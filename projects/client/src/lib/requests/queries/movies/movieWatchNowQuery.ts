import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { mapWatchNowResponseToWatchNowDetails } from '../../_internal/mapWatchNowResponseToWatchNowDetails.ts';
import { WatchNowServicesSchema } from '../../models/WatchNowServices.ts';

type MovieWatchNowParams = {
  id: number;
  country: string;
} & ApiParams;

const movieWatchNowRequest = (
  { fetch, id, country }: MovieWatchNowParams,
) =>
  api({ fetch })
    .movies
    .watchnow({
      params: {
        id,
        country,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch watch now movie');
      }

      return response.body;
    });

export const movieWatchNowQuery = defineQuery({
  key: 'movieWatchNow',
  invalidations: [],
  dependencies: (params) => [params.id, params.country],
  request: movieWatchNowRequest,
  mapper: (response, params) =>
    mapWatchNowResponseToWatchNowDetails(response, params.country),
  schema: WatchNowServicesSchema,
});
