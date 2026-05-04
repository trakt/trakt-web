import {
  SHARE_TYPE_DIMENSIONS,
  type ShareType,
} from '$lib/features/share/models/ShareType.ts';
import ShareCard from '$lib/features/share/ShareCard.svelte';
import { error } from '$lib/utils/console/print.ts';
import { IS_DEV } from '$lib/utils/env/index.ts';
import { ImageResponse } from '@ethercorps/sveltekit-og';
import type { RequestHandler } from '@sveltejs/kit';
import { buildImagePath } from './_internal/buildImagePath.ts';
import { fetchMediaData } from './_internal/fetchMediaData.ts';
import { fetchPosterDataUri } from './_internal/fetchPosterDataUri.ts';
import { fetchWithUserAgent } from './_internal/fetchWithUserAgent.ts';

const cacheControl = 'public, max-age=604800';

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
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': cacheControl,
        },
      });
    }
  }

  const fetchFn = fetchWithUserAgent({
    userAgent: request.headers.get('user-agent'),
    fetch,
  });

  const [media, ratings, crew] = await fetchMediaData({
    type,
    slug,
    fetch: fetchFn,
  });

  if (!media || !ratings || !crew) {
    return new Response('Data not found', { status: 404 });
  }

  const posterUrl = media.poster.url.medium.replace(/\.webp$/i, '');

  let posterDataUri: string;
  try {
    posterDataUri = await fetchPosterDataUri({ posterUrl, fetch: fetchFn });
  } catch (e) {
    error('Failed to fetch poster:', e);
    return new Response('Failed to fetch poster', { status: 500 });
  }

  const { width, height } = SHARE_TYPE_DIMENSIONS[shareType];

  try {
    const imageResponse = new ImageResponse(
      ShareCard,
      {
        width,
        height,
        debug: IS_DEV && url.searchParams.get('debug') === 'true',
      },
      { media, crew, ratings, posterUrl: posterDataUri, variant: shareType },
    );

    const buffer = await imageResponse.arrayBuffer();

    if (!IS_DEV && platform) {
      try {
        await platform.env.R2_WALTER.put(imagePath, buffer, {
          httpMetadata: { contentType: 'image/png' },
          customMetadata: { cachedAt: String(Date.now()) },
        });
      } catch (e) {
        error('Failed to cache image in R2:', e);
      }
    }

    const responseHeaders = new Headers(imageResponse.headers);
    responseHeaders.set('Cache-Control', cacheControl);

    return new Response(buffer, { headers: responseHeaders });
  } catch (e) {
    error('ImageResponse error:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
};
