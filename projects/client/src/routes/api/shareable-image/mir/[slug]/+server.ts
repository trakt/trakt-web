import MirShareCard from '$lib/features/share/MirShareCard.svelte';
import type { MirShareData } from '$lib/features/share/models/MirShareData.ts';
import { mirDetailQuery } from '$lib/requests/queries/users/mirDetailQuery.ts';
import { userProfileQuery } from '$lib/requests/queries/users/userProfileQuery.ts';
import type { RequestHandler } from '@sveltejs/kit';
import { render } from 'svelte/server';
import { loadImageSources } from '../../_internal/loadImageSources.ts';
import { respondWithShareImage } from '../../_internal/respondWithShareImage.ts';
import { parseMirShareParams } from '../_internal/parseMirShareParams.ts';
import { toMirShareData } from '../_internal/toMirShareData.ts';
import { withImageFallbacks } from '../_internal/withImageFallbacks.ts';

const PAST_MONTH_CACHE = 'public, max-age=604800, s-maxage=2592000';
const CURRENT_MONTH_CACHE = 'public, max-age=3600';

function toImageUrls(data: MirShareData) {
  return [
    data.user.avatarUrl,
    data.firstWatched?.posterUrl,
    data.lastWatched?.posterUrl,
    data.shows.at(0)?.posterUrl,
    data.movies.at(0)?.posterUrl,
  ];
}

export const GET: RequestHandler = (event) => {
  const params = parseMirShareParams({
    slug: event.params.slug ?? '',
    searchParams: event.url.searchParams,
    now: new Date(),
  });

  if (!params) {
    return new Response('Invalid parameters', { status: 400 });
  }

  const { slug, year, month, shape, shareType, isPastMonth } = params;

  return respondWithShareImage({
    event,
    shareType,
    imagePath: isPastMonth
      ? `images/share/mir/${shape}/${slug}/${year}-${month}.jpg`
      : null,
    cacheControl: isPastMonth ? PAST_MONTH_CACHE : CURRENT_MONTH_CACHE,
    loadData: async ({ fetch }) => {
      const [detail, profile] = await Promise.all([
        mirDetailQuery({ slug, year, month, fetch }).execute(),
        userProfileQuery({ slug, fetch }).execute(),
      ]);

      if (!detail || !profile) return null;

      return toMirShareData({ detail, profile, year, month });
    },
    prepare: async ({ data, timing }) => {
      const images = await timing.measure('images', () =>
        loadImageSources({ urls: toImageUrls(data), fetch: globalThis.fetch }),
      );
      const loaded = new Set(images.map((image) => image.src));
      const { body, head } = render(MirShareCard, {
        props: {
          data: withImageFallbacks({ data, loaded }),
          variant: shareType,
        },
      });

      return { html: body + head, images };
    },
  });
};
