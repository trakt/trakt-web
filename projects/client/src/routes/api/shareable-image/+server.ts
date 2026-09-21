import {
  SHARE_TYPE_DIMENSIONS,
  type ShareType,
} from '$lib/features/share/models/ShareType.ts';
import ShareCard from '$lib/features/share/ShareCard.svelte';
import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import { error } from '$lib/utils/console/print.ts';
import { IS_DEV } from '$lib/utils/env/index.ts';
import { ImageResponse } from '@ethercorps/sveltekit-og';
import type { RequestHandler } from '@sveltejs/kit';
import { buildImageMetadata } from './_internal/buildImageMetadata.ts';
import { buildImagePath } from './_internal/buildImagePath.ts';
import { fetchMediaData } from './_internal/fetchMediaData.ts';
import { fetchWithUserAgent } from './_internal/fetchWithUserAgent.ts';
import { loadShareFonts } from './_internal/loadShareFonts.ts';
import { resolvePosterSource } from './_internal/resolvePosterSource.ts';

const cacheControl = 'public, max-age=604800';

const imageHeaders = {
  'Content-Type': 'image/png',
  'Cache-Control': cacheControl,
};

// FIXME: add support for HMAC signed urls
export const GET: RequestHandler = async (
  { request, url, fetch, platform },
) => {
  const type = url.searchParams.get('type');
  const slug = url.searchParams.get('slug');
  const variant = url.searchParams.get('variant');

  if (!type || !slug || !variant) {
    return new Response('Missing parameters', { status: 400 });
  }

  if (type !== 'movie' && type !== 'show') {
    return new Response('Invalid type parameter', { status: 400 });
  }

  if (!/^[\w-]+$/.test(slug)) {
    return new Response('Invalid slug parameter', { status: 400 });
  }

  if (!(variant in SHARE_TYPE_DIMENSIONS)) {
    return new Response('Invalid variant parameter', { status: 400 });
  }

  if (!IS_DEV && !platform?.env?.R2_WALTER) {
    return new Response('Server configuration error', { status: 500 });
  }

  const shareType = variant as ShareType;
  const imagePath = buildImagePath({ shareType, slug, type });

  if (!IS_DEV && platform) {
    const cachedImage = await platform.env.R2_WALTER.get(imagePath);
    if (cachedImage) {
      /*
        Cast needed due to structural mismatch between Cloudflare's ReadableStream
        and the DOM ReadableStream, they're the same at runtime.
      */
      return new Response(cachedImage.body as BodyInit, {
        headers: imageHeaders,
      });
    }
  }

  const fetchFn = fetchWithUserAgent({
    userAgent: request.headers.get('user-agent'),
    fetch,
  });

  const [mediaData, fonts] = await Promise.all([
    fetchMediaData({ type, slug, fetch: fetchFn }).catch(() => null),
    loadShareFonts({ bucket: platform?.env?.R2_WALTER }),
  ]);

  if (!mediaData) {
    return new Response('Data not found', { status: 404 });
  }

  const { media, ratings, crew } = mediaData;
  const { width, height } = SHARE_TYPE_DIMENSIONS[shareType];

  const toBuffer = (posterUrl: string) =>
    new ImageResponse(
      ShareCard,
      {
        width,
        height,
        fonts,
        debug: IS_DEV && url.searchParams.get('debug') === 'true',
      },
      { media, crew, ratings, posterUrl, variant: shareType },
    ).arrayBuffer();

  try {
    const buffer = await toBuffer(
      resolvePosterSource(media.poster.url.medium),
    ).catch((e: unknown) => {
      error('Failed to render with the media poster:', e);
      return toBuffer(resolvePosterSource(MEDIA_POSTER_PLACEHOLDER));
    });

    if (!IS_DEV && platform) {
      try {
        await platform.env.R2_WALTER.put(imagePath, buffer, {
          httpMetadata: { contentType: 'image/png' },
          customMetadata: buildImageMetadata({ media, cachedAt: new Date() }),
        });
      } catch (e) {
        error('Failed to cache image in R2:', e);
      }
    }

    return new Response(buffer, { headers: imageHeaders });
  } catch (e) {
    error('ImageResponse error:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
};
