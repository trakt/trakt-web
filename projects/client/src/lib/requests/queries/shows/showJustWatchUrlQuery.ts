import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToJustWatchUrl } from '../../_internal/mapToJustWatchUrl.ts';
import { HttpsUrlSchema } from '../../models/HttpsUrlSchema.ts';

type ShowJustWatchUrlParams = {
  slug: string;
  country: string;
} & ApiParams;

const showJustWatchUrlRequest = (
  { fetch, slug, country }: ShowJustWatchUrlParams,
) =>
  api({ fetch })
    .shows
    .justwatch
    .link({
      params: {
        id: slug,
        country,
      },
    });

export const showJustWatchUrlQuery = defineQuery({
  key: 'showJustWatchUrl',
  invalidations: [],
  dependencies: (params) => [params.slug, params.country],
  request: showJustWatchUrlRequest,
  mapper: (response, params) =>
    mapToJustWatchUrl(response.body, params.country),
  schema: HttpsUrlSchema.nullable(),
  ttl: time.days(1),
});
