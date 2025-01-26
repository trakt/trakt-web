import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapWatchNowResponseToWatchNowDetails } from '../../_internal/mapWatchNowResponseToWatchNowDetails.ts';
import { WatchNowServicesSchema } from '../../models/WatchNowServices.ts';

type ShowWatchNowParams = {
  id: number;
  country: string;
} & ApiParams;

const showWatchNowRequest = (
  { fetch, id, country }: ShowWatchNowParams,
) =>
  api({ fetch })
    .shows
    .watchnow({
      params: {
        id,
        country,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch watch now show');
      }

      return response.body;
    });

export const showWatchNowQuery = defineQuery({
  key: 'showWatchNow',
  invalidations: [],
  dependencies: (params) => [params.id, params.country],
  request: showWatchNowRequest,
  mapper: (response, params) =>
    mapWatchNowResponseToWatchNowDetails(response, params.country),
  schema: WatchNowServicesSchema,
  ttl: time.days(1),
});
