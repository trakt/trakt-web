import { isShareSlug } from '$lib/features/share/isShareSlug.ts';
import ProfileShareCard from '$lib/features/share/ProfileShareCard.svelte';
import type { ProfileShareData } from '$lib/features/share/models/ProfileShareData.ts';
import { userProfileQuery } from '$lib/requests/queries/users/userProfileQuery.ts';
import type { RequestHandler } from '@sveltejs/kit';
import { render } from 'svelte/server';
import { loadImageSources } from '../../_internal/loadImageSources.ts';
import { respondWithShareImage } from '../../_internal/respondWithShareImage.ts';
import { toProfileImagePath } from '../_internal/toProfileImagePath.ts';
import { toProfileShareData } from '../_internal/toProfileShareData.ts';

export const GET: RequestHandler = (event) => {
  const slug = event.params.slug ?? '';

  if (!isShareSlug(slug)) {
    return new Response('Invalid slug parameter', { status: 400 });
  }

  return respondWithShareImage<ProfileShareData>({
    event,
    shareType: 'open-graph',
    imagePath: (data) => toProfileImagePath({ slug, data }),
    cacheControl: 'public, max-age=86400, s-maxage=604800',
    loadData: async ({ fetch }) => {
      const profile = await userProfileQuery({ slug, fetch }).execute();

      return profile ? toProfileShareData(profile) : null;
    },
    prepare: async ({ data, timing }) => {
      const { avatarUrl } = data.user;
      const urls = [avatarUrl, data.coverUrl].filter((url): url is string =>
        Boolean(url),
      );
      const images = await timing.measure('images', () =>
        loadImageSources({ urls, fetch: globalThis.fetch }),
      );
      const loaded = new Set(images.map((image) => image.src));
      const toLoaded = (url: string | Nil) =>
        url && loaded.has(url) ? url : null;
      const { body, head } = render(ProfileShareCard, {
        props: {
          data: {
            ...data,
            coverUrl: toLoaded(data.coverUrl),
            user: { ...data.user, avatarUrl: toLoaded(avatarUrl) },
          },
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
