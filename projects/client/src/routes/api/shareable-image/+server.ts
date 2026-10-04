import {
  SHARE_TYPE_DIMENSIONS,
  type ShareType,
} from '$lib/features/share/models/ShareType.ts';
import type { RequestHandler } from '@sveltejs/kit';
import { respondWithMediaShareImage } from './_internal/respondWithMediaShareImage.ts';

// FIXME: add support for HMAC signed urls
export const GET: RequestHandler = (event) => {
  const { url } = event;
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

  return respondWithMediaShareImage({
    event,
    type,
    slug,
    shareType: variant as ShareType,
    cacheControl: 'public, max-age=604800',
  });
};
