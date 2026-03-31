import {
  SHARE_TYPE_DIMENSIONS,
  type ShareType,
} from '$lib/features/share/models/ShareType.ts';
import ShareCard from '$lib/features/share/ShareCard.svelte';
import { error } from '$lib/utils/console/print.ts';
import { IS_DEV } from '$lib/utils/env/index.ts';
import { ImageResponse } from '@ethercorps/sveltekit-og';
import type { RequestHandler } from '@sveltejs/kit';
import { fetchMediaData } from './_internal/fetchMediaData.ts';
import { fetchPosterDataUri } from './_internal/fetchPosterDataUri.ts';
import { fetchWithUserAgent } from './_internal/fetchWithUserAgent.ts';

export const GET: RequestHandler = async ({ request, url, fetch }) => {
  if (!IS_DEV) {
    return new Response('Not found', { status: 404 });
  }

  const type = url.searchParams.get('type');
  const slug = url.searchParams.get('slug');
  const variant = url.searchParams.get('variant');

  if (!type || !slug || !variant) {
    return new Response('Missing parameters', { status: 400 });
  }

  if (type !== 'movie' && type !== 'show') {
    return new Response('Invalid type parameter', { status: 400 });
  }

  if (!(variant in SHARE_TYPE_DIMENSIONS)) {
    return new Response('Invalid variant parameter', { status: 400 });
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

  const shareType = variant as ShareType;
  const { width, height } = SHARE_TYPE_DIMENSIONS[shareType];

  try {
    const imageResponse = new ImageResponse(
      ShareCard,
      {
        width,
        height,
        debug: url.searchParams.get('debug') === 'true',
      },
      {
        media,
        crew,
        ratings,
        posterUrl: posterDataUri,
        variant: shareType,
      },
    );
    const buffer = await imageResponse.arrayBuffer();
    return new Response(buffer, { headers: imageResponse.headers });
  } catch (e) {
    error('ImageResponse error:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
};
