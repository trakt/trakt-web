import { api, type ApiParams } from '../../_internal/api.ts';
import { mapWatchNowResponseToWatchNowDetails } from '../../_internal/mapWatchNowResponseToWatchNowDetails.ts';
import type { WatchNowServices } from '../../models/WatchNowServices.ts';

type ShowWatchNowParams = {
  slug: string;
  country: string;
} & ApiParams;

function showWatchNowRequest(
  { fetch, slug, country }: ShowWatchNowParams,
): Promise<WatchNowServices> {
  return api({ fetch })
    .shows
    .watchnow({
      params: {
        id: slug,
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

const showWatchNowQueryKey = (id: string, country: string) =>
  ['showWatchNow', id, country] as const;
export const showWatchNowQuery = (
  params: ShowWatchNowParams,
) => ({
  queryKey: showWatchNowQueryKey(params.slug, params.country),
  queryFn: () => showWatchNowRequest(params),
});
