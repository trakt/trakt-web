import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToJustWatchUrl } from '../../_internal/mapToJustWatchUrl.ts';
import { HttpsUrlSchema } from '../../models/HttpsUrlSchema.ts';

type MovieJustWatchUrlParams = {
  slug: string;
  country: string;
} & ApiParams;

const movieJustWatchUrlRequest = (
  { fetch, slug, country }: MovieJustWatchUrlParams,
) =>
  api({ fetch })
    .movies
    .justwatch
    .link({
      params: {
        id: slug,
        country,
      },
    });

export const movieJustWatchUrlQuery = defineQuery({
  key: 'movieJustWatchUrl',
  invalidations: [],
  dependencies: (params) => [params.slug, params.country],
  request: movieJustWatchUrlRequest,
  mapper: (response, params) =>
    mapToJustWatchUrl(response.body, params.country),
  schema: HttpsUrlSchema.nullable(),
  ttl: time.hours(3),
});
