import ProfileShareCard from '$lib/features/share/ProfileShareCard.svelte';
import type { ProfileShareData } from '$lib/features/share/models/ProfileShareData.ts';
import { userProfileQuery } from '$lib/requests/queries/users/userProfileQuery.ts';
import type { RequestHandler } from '@sveltejs/kit';
import { render } from 'svelte/server';
import { loadImageSources } from '../../_internal/loadImageSources.ts';
import { respondWithShareImage } from '../../_internal/respondWithShareImage.ts';
import { toProfileImagePath } from '../_internal/toProfileImagePath.ts';
import { toProfileShareData } from '../_internal/toProfileShareData.ts';

type ProfileImageSource = {
  canonicalSlug: string;
  data: ProfileShareData;
};

export const GET: RequestHandler = (event) => {
  const slug = event.params.slug ?? '';

  if (!/^[\w-]+$/.test(slug)) {
    return new Response('Invalid slug parameter', { status: 400 });
  }

  return respondWithShareImage<ProfileImageSource>({
    event,
    shareType: 'open-graph',
    imagePath: ({ canonicalSlug, data }) =>
      toProfileImagePath({ slug: canonicalSlug, data }),
    cacheControl: 'public, max-age=86400, s-maxage=604800',
    loadData: async ({ fetch }) => {
      const profile = await userProfileQuery({ slug, fetch }).execute();
      if (!profile || profile.isDeleted) return null;

      return {
        canonicalSlug: profile.slug ?? slug,
        data: toProfileShareData(profile),
      };
    },
    prepare: async ({ data: { data }, timing }) => {
      const images = await timing.measure('images', () =>
        loadImageSources({
          urls: [data.user.avatarUrl],
          fetch: globalThis.fetch,
        }),
      );
      const avatarUrl = data.user.avatarUrl;
      const isAvatarLoaded = images.some((image) => image.src === avatarUrl);
      const { body, head } = render(ProfileShareCard, {
        props: {
          data: {
            ...data,
            user: {
              ...data.user,
              avatarUrl: isAvatarLoaded ? avatarUrl : null,
            },
          },
        },
      });

      return {
        html: body + head,
        images,
        isComplete: !avatarUrl || isAvatarLoaded,
      };
    },
  });
};
