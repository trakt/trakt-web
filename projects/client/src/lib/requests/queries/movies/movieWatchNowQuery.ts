import { api, type ApiParams } from '../../_internal/api.ts';
import { mapWatchNowResponseToWatchNowDetails } from '../../_internal/mapWatchNowResponseToWatchNowDetails.ts';
import type { WatchNowServices } from '../../models/WatchNowServices.ts';

type MovieWatchNowParams = {
  id: number;
  country: string;
} & ApiParams;

function movieWatchNowRequest(
  { fetch, id, country }: MovieWatchNowParams,
): Promise<WatchNowServices> {
  return api({ fetch })
    .movies
    .watchnow({
      params: {
        id,
        country,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch watch now movie');
      }

      return mapWatchNowResponseToWatchNowDetails(body, country);
    });
}

const movieWatchNowQueryKey = (id: number, country: string) =>
  ['movieWatchNow', id, country] as const;
export const movieWatchNowQuery = (
  params: MovieWatchNowParams,
) => ({
  queryKey: movieWatchNowQueryKey(params.id, params.country),
  queryFn: () => movieWatchNowRequest(params),
});
