import {
  SHARE_TYPE_DIMENSIONS,
  type ShareType,
} from '$lib/features/share/models/ShareType.ts';
import { error } from '$lib/utils/console/print.ts';
import { IS_DEV } from '$lib/utils/env/index.ts';
import type { RequestHandler } from '@sveltejs/kit';
import { fetchWithUserAgent } from '../_internal/fetchWithUserAgent.ts';
import { respondWithMediaShareImage } from '../_internal/respondWithMediaShareImage.ts';
import { fetchTrendingSlugs } from './_internal/fetchTrendingSlugs.ts';
import { parseShareDate } from './_internal/parseShareDate.ts';
import { resolveTrendingSlug } from './_internal/resolveTrendingSlug.ts';

export const GET: RequestHandler = async (event) => {
  const { request, url, fetch, platform } = event;
  const type = url.searchParams.get('type');
  const variant = url.searchParams.get('variant');

  if (!type || !variant) {
    return new Response('Missing parameters', { status: 400 });
  }

  if (type !== 'movie' && type !== 'show') {
    return new Response('Invalid type parameter', { status: 400 });
  }

  if (!(variant in SHARE_TYPE_DIMENSIONS)) {
    return new Response('Invalid variant parameter', { status: 400 });
  }

  const slug = await resolveTrendingSlug({
    type,
    date: parseShareDate(url.searchParams.get('date')),
    now: new Date(),
    bucket: IS_DEV ? null : platform?.env?.R2_WALTER,
    fetchSlugs: () =>
      fetchTrendingSlugs({
        type,
        fetch: fetchWithUserAgent({
          userAgent: request.headers.get('user-agent'),
          fetch,
        }),
      }),
  }).catch((e: unknown) => {
    error('Failed to resolve trending media:', e);
    return undefined;
  });

  if (!slug) {
    return new Response('Data not found', { status: 404 });
  }

  return respondWithMediaShareImage({
    event,
    type,
    slug,
    shareType: variant as ShareType,
    cacheControl: 'public, max-age=3600',
  });
};
