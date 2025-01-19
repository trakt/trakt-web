import { api, type ApiParams } from '../../_internal/api.ts';
import { mapWatchNowResponseToWatchNowDetails } from '../../_internal/mapWatchNowResponseToWatchNowDetails.ts';
import type { WatchNowServices } from '../../models/WatchNowServices.ts';

type EpisodeWatchNowParams = {
  id: number;
  country: string;
} & ApiParams;

function episodeWatchNowRequest(
  { fetch, id, country }: EpisodeWatchNowParams,
): Promise<WatchNowServices> {
  return api({ fetch })
    .episodes
    .watchnow({
      params: {
        id,
        country,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch watch now episode');
      }

      return mapWatchNowResponseToWatchNowDetails(body, country);
    });
}

const episodeWatchNowQueryKey = (id: number, country: string) =>
  ['episodeWatchNow', id, country] as const;
export const episodeWatchNowQuery = (
  params: EpisodeWatchNowParams,
) => ({
  queryKey: episodeWatchNowQueryKey(params.id, params.country),
  queryFn: () => episodeWatchNowRequest(params),
});
