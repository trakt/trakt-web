import type { YirPersonaResult } from '$lib/requests/models/YirPersonaResult.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import { userProfileQuery } from '$lib/requests/queries/users/userProfileQuery.ts';
import { yirPersonaQuery } from '$lib/requests/queries/users/yirPersonaQuery.ts';
import YirShareCard from '$lib/sections/yir/2026/YirShareCard.svelte';
import { toYirShareData } from '$lib/sections/yir/2026/toYirShareData.ts';
import { yirShareCardWidth } from '$lib/sections/yir/2026/yirShareCardWidth.ts';
import { DEFAULT_SHARE_COVER } from '$lib/utils/assets.ts';
import { isHttpUrl } from '$lib/utils/url/isHttpUrl.ts';
import type { RequestHandler } from '@sveltejs/kit';
import { render } from 'svelte/server';
import { isSettledShareImageFresh } from '../../_internal/isSettledShareImageFresh.ts';
import { loadImageSources } from '../../_internal/loadImageSources.ts';
import { respondWithShareImage } from '../../_internal/respondWithShareImage.ts';
import { toShareUser } from '../../_internal/toShareUser.ts';
import { loadPersonaShareFonts } from '../_internal/loadPersonaShareFonts.ts';
import { parseYirShareParams } from '../_internal/parseYirShareParams.ts';
import { resolveContainerUnits } from '../_internal/resolveContainerUnits.ts';
import { toYirImagePath } from '../_internal/toYirImagePath.ts';

type YirImageSource = {
  profile: UserProfile;
  loadResult: () => Promise<YirPersonaResult | null>;
};

const SETTLED_YEAR_CACHE = 'public, max-age=86400, s-maxage=86400';
const OPEN_YEAR_CACHE = 'public, max-age=3600';

export const GET: RequestHandler = (event) => {
  const now = new Date();
  const params = parseYirShareParams({
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
    shape,
    shareType,
    isSettled,
    settlesAt,
    hasExplicitYear,
  } = params;

  return respondWithShareImage<YirImageSource>({
    event,
    shareType,
    imagePath: ({ profile }) =>
      toYirImagePath({
        shape,
        slug: profile.slug ?? slug,
        year,
        user: toShareUser(profile),
      }),
    isFresh: (cachedAt) =>
      isSettledShareImageFresh({ cachedAt, now, settlesAt }),
    cacheControl:
      isSettled && hasExplicitYear ? SETTLED_YEAR_CACHE : OPEN_YEAR_CACHE,
    toRedirect: ({ profile }) => (profile.isVip ? null : DEFAULT_SHARE_COVER),
    loadData: async ({ fetch }) => {
      const profile = await userProfileQuery({ slug, fetch }).execute();
      if (!profile || profile.private || profile.isDeleted) return null;

      return {
        profile,
        loadResult: () =>
          yirPersonaQuery({ slug, year, fetch })
            .execute()
            .catch(() => null),
      };
    },
    prepare: async ({ data: { profile, loadResult }, timing }) => {
      const result = await timing.measure('persona', loadResult);
      if (!result) return null;

      const data = toYirShareData({
        result,
        user: toShareUser(profile),
        year,
      });
      const avatarUrl = data.user.avatarUrl;
      const urls = avatarUrl && isHttpUrl(avatarUrl) ? [avatarUrl] : [];

      const [images, personaFonts] = await Promise.all([
        timing.measure('images', () =>
          loadImageSources({ urls, fetch: globalThis.fetch }),
        ),
        timing.measure('persona-fonts', () =>
          loadPersonaShareFonts({
            persona: result.persona,
            bucket: event.platform?.env?.R2_WALTER,
            fetch: globalThis.fetch,
          }),
        ),
      ]);

      const loaded = new Set(images.map((image) => image.src));
      const hasAvatar = urls.every((url) => loaded.has(url));
      const { body, head } = render(YirShareCard, {
        props: {
          data: hasAvatar
            ? data
            : { ...data, user: { ...data.user, avatarUrl: null } },
          variant: shareType,
        },
      });

      return {
        html: resolveContainerUnits({
          html: body + head,
          width: yirShareCardWidth(shareType),
        }),
        images,
        fonts: personaFonts.fonts,
        isComplete: hasAvatar && personaFonts.isComplete,
      };
    },
  });
};
