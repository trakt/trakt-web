import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToJustWatchUrl } from '../../_internal/mapToJustWatchUrl.ts';
import { HttpsUrlSchema } from '../../models/HttpsUrlSchema.ts';

type ShowSeasonJustWatchUrlParams = {
  slug: string;
  country: string;
  season: number;
} & ApiParams;

const showSeasonJustWatchUrlRequest = (
  { fetch, slug, country, season }: ShowSeasonJustWatchUrlParams,
) =>
  api({ fetch })
    .shows
    .season
    .justwatch
    .link({
      params: {
        id: slug,
        country,
        season: `${season}`,
      },
    });

export const showSeasonJustWatchUrlQuery = defineQuery({
  key: 'showSeasonJustWatchUrl',
  invalidations: [],
  dependencies: (params) => [params.slug, params.country, params.season],
  request: showSeasonJustWatchUrlRequest,
  mapper: (response, params) =>
    mapToJustWatchUrl(response.body, params.country),
  schema: HttpsUrlSchema.nullable(),
  ttl: time.hours(3),
});
