import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapWatchNowResponseToWatchNowDetails } from '../../_internal/mapWatchNowResponseToWatchNowDetails.ts';
import { WatchNowServicesSchema } from '../../models/WatchNowServices.ts';

type EpisodeWatchNowParams = {
  id: number;
  country: string;
} & ApiParams;

const episodeWatchNowRequest = (
  { fetch, id, country }: EpisodeWatchNowParams,
) =>
  api({ fetch })
    .episodes
    .watchnow({
      params: {
        id,
        country,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch watch now episode');
      }

      return response.body;
    });

export const episodeWatchNowQuery = defineQuery({
  key: 'episodeWatchNow',
  invalidations: [],
  dependencies: (params) => [params.id, params.country],
  request: episodeWatchNowRequest,
  mapper: (response, params) =>
    mapWatchNowResponseToWatchNowDetails(response, params.country),
  schema: WatchNowServicesSchema,
});
