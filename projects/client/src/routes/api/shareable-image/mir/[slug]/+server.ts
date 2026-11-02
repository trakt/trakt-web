import MirShareCard from '$lib/features/share/MirShareCard.svelte';
import type { MirShareData } from '$lib/features/share/models/MirShareData.ts';
import { mirDetailQuery } from '$lib/requests/queries/users/mirDetailQuery.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { userProfileQuery } from '$lib/requests/queries/users/userProfileQuery.ts';
import { isHttpUrl } from '$lib/utils/url/isHttpUrl.ts';
import type { RequestHandler } from '@sveltejs/kit';
import { render } from 'svelte/server';
import { loadImageSources } from '../../_internal/loadImageSources.ts';
import { respondWithShareImage } from '../../_internal/respondWithShareImage.ts';
import { toShareUser } from '../../_internal/toShareUser.ts';
import { isMirImageFresh } from '../_internal/isMirImageFresh.ts';
import { parseMirShareParams } from '../_internal/parseMirShareParams.ts';
import { toMirImagePath } from '../_internal/toMirImagePath.ts';
import { toMirShareData } from '../_internal/toMirShareData.ts';
import { withImageFallbacks } from '../_internal/withImageFallbacks.ts';

type MirImageSource = {
  profile: UserProfile;
  loadDetail: () => ReturnType<ReturnType<typeof mirDetailQuery>['execute']>;
};

const SETTLED_MONTH_CACHE = 'public, max-age=86400, s-maxage=604800';
const OPEN_MONTH_CACHE = 'public, max-age=3600';

function toImageUrls(data: MirShareData): ReadonlyArray<string> {
  return [
    data.user.avatarUrl,
    data.firstWatched?.posterUrl,
    data.lastWatched?.posterUrl,
    (data.shows.at(0) ?? data.movies.at(0))?.posterUrl,
  ].filter((url): url is string => typeof url === 'string' && isHttpUrl(url));
}

export const GET: RequestHandler = (event) => {
  const now = new Date();
  const params = parseMirShareParams({
    slug: event.params.slug ?? '',
    searchParams: event.url.searchParams,
    now,
  });

  if (!params) {
    return new Response('Invalid parameters', { status: 400 });
  }

  const {
    slug,
    year,
    month,
    shape,
    shareType,
    isSettled,
    settlesAt,
    hasExplicitMonth,
  } = params;

  return respondWithShareImage<MirImageSource>({
    event,
    shareType,
    imagePath: ({ profile }) =>
      toMirImagePath({ shape, slug, year, month, user: toShareUser(profile) }),
    isFresh: (cachedAt) => isMirImageFresh({ cachedAt, now, settlesAt }),
    cacheControl:
      isSettled && hasExplicitMonth ? SETTLED_MONTH_CACHE : OPEN_MONTH_CACHE,
    loadData: async ({ fetch }) => {
      const profile = await userProfileQuery({ slug, fetch }).execute();
      if (!profile) return null;

      return {
        profile,
        loadDetail: () =>
          mirDetailQuery({ slug, year, month, fetch })
            .execute()
            .catch(() => null),
      };
    },
    prepare: async ({ data: { profile, loadDetail }, timing }) => {
      const detail = await timing.measure('detail', loadDetail);
      if (!detail) return null;

      const data = toMirShareData({ detail, profile, year, month });
      const urls = toImageUrls(data);
      const images = await timing.measure('images', () =>
        loadImageSources({ urls, fetch: globalThis.fetch }),
      );
      const loaded = new Set(images.map((image) => image.src));
      const { body, head } = render(MirShareCard, {
        props: {
          data: withImageFallbacks({ data, loaded }),
          variant: shareType,
        },
      });

      return {
        html: body + head,
        images,
        isComplete: urls.every((url) => loaded.has(url)),
      };
    },
  });
};
