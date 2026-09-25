import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToYouTubeSpecial } from '../../_internal/mapToYouTubeSpecial.ts';
import { toMediaInfoPath } from '../../_internal/toMediaInfoPath.ts';
import { YouTubeSpecialSchema } from '../../models/YouTubeSpecial.ts';
import { YouTubeSpecialResponseSchema } from '../../models/YouTubeSpecialResponse.ts';

const YOUTUBE_SPECIAL_INFO_TYPE = 17;

type MovieYouTubeSpecialParams = {
  slug: string;
  locale: AvailableLocale;
  enabled: boolean;
} & ApiParams;

const movieYouTubeSpecialRequest = async (
  { fetch, slug, locale }: MovieYouTubeSpecialParams,
) => {
  const response = await rawApiFetch(
    {
      fetch,
      path: toMediaInfoPath({
        type: 'movie',
        slug,
        infoType: YOUTUBE_SPECIAL_INFO_TYPE,
        locale,
      }),
    },
  );

  return response.ok
    ? {
      body: YouTubeSpecialResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: undefined, status: 200 };
};

export const movieYouTubeSpecialQuery = defineQuery({
  key: 'movieYouTubeSpecial',
  invalidations: [],
  dependencies: (params) => [params.slug, params.locale],
  request: movieYouTubeSpecialRequest,
  mapper: (response) => mapToYouTubeSpecial(response.body),
  schema: YouTubeSpecialSchema.nullish(),
  ttl: time.hours(12),
  enabled: (params) => params.enabled,
});
