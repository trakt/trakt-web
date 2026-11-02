import type { ShareType } from '$lib/features/share/models/ShareType.ts';
import ShareCard from '$lib/features/share/ShareCard.svelte';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import { error } from '$lib/utils/console/print.ts';
import { IS_DEV } from '$lib/utils/env/index.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { RequestEvent } from '@sveltejs/kit';
import type { ImageSource } from '@takumi-rs/wasm';
import { render } from 'svelte/server';
import { buildImageMetadata } from './buildImageMetadata.ts';
import { buildImagePath } from './buildImagePath.ts';
import { createServerTiming } from './createServerTiming.ts';
import { fetchMediaData } from './fetchMediaData.ts';
import { fetchWithoutAuthorization } from './fetchWithoutAuthorization.ts';
import { fetchWithUserAgent } from './fetchWithUserAgent.ts';
import { loadFallbackShareFonts } from './loadFallbackShareFonts.ts';
import { loadPosterImages } from './loadPosterImages.ts';
import { loadShareFonts } from './loadShareFonts.ts';
import { renderShareCard } from './renderShareCard.ts';
import { resolvePosterSource } from './resolvePosterSource.ts';
import { shareImageCacheControl } from './shareImageCacheControl.ts';
import { shareImageTimeToLive } from './shareImageTimeToLive.ts';
import { warmPoster } from './warmPoster.ts';

type RespondWithMediaShareImageProps = {
  event: Pick<RequestEvent, 'request' | 'url' | 'fetch' | 'platform'>;
  type: MediaType;
  slug: string;
  shareType: ShareType;
  cacheControl?: string;
};

const PLACEHOLDER_TIME_TO_LIVE_MS = time.minutes(10);

function cachedTimeToLive(
  metadata: Record<string, string> | undefined,
  now: number,
): number {
  const cachedAt = Date.parse(metadata?.cachedAt ?? '');
  const releasedAt = Date.parse(metadata?.releasedAt ?? '');

  if (Number.isNaN(cachedAt) || Number.isNaN(releasedAt)) {
    return 0;
  }

  return shareImageTimeToLive({ cachedAt, releasedAt, now });
}

export async function respondWithMediaShareImage({
  event,
  type,
  slug,
  shareType,
  cacheControl,
}: RespondWithMediaShareImageProps): Promise<Response> {
  const { request, url, fetch, platform } = event;

  if (!IS_DEV && !platform?.env?.R2_WALTER) {
    return new Response('Server configuration error', { status: 500 });
  }

  const imagePath = buildImagePath({ shareType, slug, type });
  const timing = createServerTiming();
  const isTimed = url.searchParams.get('timing') === 'true';
  const responseHeaders = (timeToLiveMs: number) => {
    const imageHeaders = {
      'Content-Type': 'image/jpeg',
      'Cache-Control': cacheControl ?? shareImageCacheControl(timeToLiveMs),
    };

    return isTimed
      ? { ...imageHeaders, 'Server-Timing': timing.toHeader() }
      : imageHeaders;
  };

  if (!IS_DEV && platform) {
    const cachedImage = await timing.measure('cache', () =>
      platform.env.R2_WALTER.get(imagePath),
    );
    const timeToLiveMs = cachedTimeToLive(
      cachedImage?.customMetadata,
      Date.now(),
    );

    if (cachedImage && timeToLiveMs > 0) {
      /*
        Cast needed due to structural mismatch between Cloudflare's ReadableStream
        and the DOM ReadableStream, they're the same at runtime.
      */
      return new Response(cachedImage.body as unknown as BodyInit, {
        headers: responseHeaders(timeToLiveMs),
      });
    }
  }

  const fontsRequest = timing.measure(
    'fonts',
    async () =>
      (await loadShareFonts({ bucket: platform?.env?.R2_WALTER })) ??
      (await loadFallbackShareFonts(globalThis.fetch).catch((e: unknown) => {
        error('Failed to load fallback share fonts:', e);
        return [];
      })),
  );

  const fetchFn = fetchWithoutAuthorization(
    fetchWithUserAgent({
      userAgent: request.headers.get('user-agent'),
      fetch,
    }),
  );

  const mediaDataRequest = timing.measure('data', () =>
    fetchMediaData({
      type,
      slug,
      fetch: fetchFn,
      onSummary: (media) =>
        timing.measure('poster', () =>
          warmPoster({
            posterUrl: resolvePosterSource(media.poster.url.medium),
            fetch: globalThis.fetch,
          }),
        ),
    }).catch(() => null),
  );

  const [mediaData, fonts] = await Promise.all([
    mediaDataRequest,
    fontsRequest,
  ]);

  if (!mediaData) {
    return new Response('Data not found', { status: 404 });
  }

  const { media, ratings, crew } = mediaData;
  const placeholderPoster = {
    posterUrl: resolvePosterSource(MEDIA_POSTER_PLACEHOLDER),
    images: [],
    isPlaceholder: true,
  };

  const loadPoster = async (posterUrl: string) => {
    const images = await timing.measure('images', () =>
      loadPosterImages({ posterUrl, fetch: globalThis.fetch }),
    );

    if (!images) {
      return placeholderPoster;
    }

    return {
      posterUrl,
      images,
      isPlaceholder: posterUrl === placeholderPoster.posterUrl,
    };
  };

  const toBuffer = ({
    posterUrl,
    images,
  }: {
    posterUrl: string;
    images: ImageSource[];
  }) => {
    const { body, head } = render(ShareCard, {
      props: { media, crew, ratings, posterUrl, variant: shareType },
    });

    return renderShareCard({
      html: body + head,
      variant: shareType,
      fonts,
      images,
      debug: IS_DEV && url.searchParams.get('debug') === 'true',
    });
  };

  try {
    const { buffer, isPlaceholder } = await loadPoster(
      resolvePosterSource(media.poster.url.medium),
    )
      .then(async (poster) => ({
        buffer: await toBuffer(poster),
        isPlaceholder: poster.isPlaceholder,
      }))
      .catch(async (e: unknown) => {
        error('Failed to render with the media poster:', e);
        const buffer = await toBuffer(placeholderPoster);
        return { buffer, isPlaceholder: true };
      });

    const metadata = buildImageMetadata({ media, cachedAt: new Date() });

    if (isPlaceholder) {
      return new Response(buffer, {
        headers: responseHeaders(PLACEHOLDER_TIME_TO_LIVE_MS),
      });
    }

    if (!IS_DEV && platform) {
      const cached = platform.env.R2_WALTER.put(imagePath, buffer, {
        httpMetadata: { contentType: 'image/jpeg' },
        customMetadata: metadata,
      }).catch((e: unknown) => error('Failed to cache image in R2:', e));

      if (platform.context) {
        platform.context.waitUntil(cached);
      } else {
        await cached;
      }
    }

    return new Response(buffer, {
      headers: responseHeaders(cachedTimeToLive(metadata, Date.now())),
    });
  } catch (e) {
    error('ImageResponse error:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
