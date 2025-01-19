import { api, type ApiParams } from '../../_internal/api.ts';
import { mapWatchNowResponseToWatchNowDetails } from '../../_internal/mapWatchNowResponseToWatchNowDetails.ts';
import type { WatchNowServices } from '../../models/WatchNowServices.ts';

type ShowWatchNowParams = {
  id: number;
  country: string;
} & ApiParams;

function showWatchNowRequest(
  { fetch, id, country }: ShowWatchNowParams,
): Promise<WatchNowServices> {
  return api({ fetch })
    .shows
    .watchnow({
      params: {
        id,
        country,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch watch now show');
      }

      return mapWatchNowResponseToWatchNowDetails(body, country);
    });
}

const showWatchNowQueryKey = (id: number, country: string) =>
  ['showWatchNow', id, country] as const;
export const showWatchNowQuery = (
  params: ShowWatchNowParams,
) => ({
  queryKey: showWatchNowQueryKey(params.id, params.country),
  queryFn: () => showWatchNowRequest(params),
});
