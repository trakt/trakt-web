import type { ShareType } from '$lib/features/share/models/ShareType.ts';
import ShareCard from '$lib/features/share/ShareCard.svelte';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import { error } from '$lib/utils/console/print.ts';
import { IS_DEV } from '$lib/utils/env/index.ts';
import type { RequestEvent } from '@sveltejs/kit';
import { render } from 'svelte/server';
import { buildImageMetadata } from './buildImageMetadata.ts';
import { buildImagePath } from './buildImagePath.ts';
import { createServerTiming } from './createServerTiming.ts';
import { fetchMediaData } from './fetchMediaData.ts';
import { fetchWithUserAgent } from './fetchWithUserAgent.ts';
import { loadFallbackShareFonts } from './loadFallbackShareFonts.ts';
import { loadPosterImages } from './loadPosterImages.ts';
import { loadShareFonts } from './loadShareFonts.ts';
import { renderShareCard } from './renderShareCard.ts';
import { resolvePosterSource } from './resolvePosterSource.ts';
import { warmPoster } from './warmPoster.ts';

type RespondWithMediaShareImageProps = {
  event: Pick<RequestEvent, 'request' | 'url' | 'fetch' | 'platform'>;
  type: MediaType;
  slug: string;
  shareType: ShareType;
  cacheControl: string;
};

export async function respondWithMediaShareImage(
  { event, type, slug, shareType, cacheControl }:
    RespondWithMediaShareImageProps,
): Promise<Response> {
  const { request, url, fetch, platform } = event;

  if (!IS_DEV && !platform?.env?.R2_WALTER) {
    return new Response('Server configuration error', { status: 500 });
  }

  const imageHeaders = {
    'Content-Type': 'image/jpeg',
    'Cache-Control': cacheControl,
  };

  const imagePath = buildImagePath({ shareType, slug, type });
  const timing = createServerTiming();
  const isTimed = url.searchParams.get('timing') === 'true';
  const responseHeaders = () =>
    isTimed
      ? { ...imageHeaders, 'Server-Timing': timing.toHeader() }
      : imageHeaders;

  if (!IS_DEV && platform) {
    const cachedImage = await timing.measure(
      'cache',
      () => platform.env.R2_WALTER.get(imagePath),
    );
    if (cachedImage) {
      /*
        Cast needed due to structural mismatch between Cloudflare's ReadableStream
        and the DOM ReadableStream, they're the same at runtime.
      */
      return new Response(cachedImage.body as BodyInit, {
        headers: responseHeaders(),
      });
    }
  }

  const fontsRequest = timing.measure(
    'fonts',
    async () =>
      await loadShareFonts({ bucket: platform?.env?.R2_WALTER }) ??
        await loadFallbackShareFonts(globalThis.fetch).catch((e: unknown) => {
          error('Failed to load fallback share fonts:', e);
          return [];
        }),
  );

  const fetchFn = fetchWithUserAgent({
    userAgent: request.headers.get('user-agent'),
    fetch,
  });

  const mediaDataRequest = timing.measure(
    'data',
    () =>
      fetchMediaData({
        type,
        slug,
        fetch: fetchFn,
        onSummary: (media) =>
          timing.measure('poster', () =>
            warmPoster({
              posterUrl: resolvePosterSource(media.poster.url.medium),
              fetch: globalThis.fetch,
            })),
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
  const toBuffer = async (posterUrl: string) => {
    const images = await timing.measure(
      'images',
      () => loadPosterImages({ posterUrl, fetch: globalThis.fetch }),
    );
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
    const buffer = await toBuffer(
      resolvePosterSource(media.poster.url.medium),
    ).catch((e: unknown) => {
      error('Failed to render with the media poster:', e);
      return toBuffer(resolvePosterSource(MEDIA_POSTER_PLACEHOLDER));
    });

    if (!IS_DEV && platform) {
      const cached = platform.env.R2_WALTER
        .put(imagePath, buffer, {
          httpMetadata: { contentType: 'image/jpeg' },
          customMetadata: buildImageMetadata({ media, cachedAt: new Date() }),
        })
        .catch((e: unknown) => error('Failed to cache image in R2:', e));

      if (platform.context) {
        platform.context.waitUntil(cached);
      } else {
        await cached;
      }
    }

    return new Response(buffer, { headers: responseHeaders() });
  } catch (e) {
    error('ImageResponse error:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
