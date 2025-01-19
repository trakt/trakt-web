import type { WatchNowSource } from '$lib/requests/models/WatchNowSources.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { WatchNowSourceResponse } from '@trakt/api';
import { api, type ApiParams } from '../../_internal/api.ts';

type WatchNowSourcesParams = ApiParams;

function mapWatchNowSourceResponse(
  sourceResponse: WatchNowSourceResponse,
): WatchNowSource {
  return {
    source: sourceResponse.source,
    name: sourceResponse.name,
    isFree: sourceResponse.free,
    logoUrl: prependHttps(sourceResponse.images.logo),
  };
}

function watchNowSourcesRequest(
  { fetch }: WatchNowSourcesParams,
): Promise<Map<string, WatchNowSource[]>> {
  return api({ fetch })
    .watchnow
    .sources()
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch watch now sources');
      }

      return body
        .reduce((map, countryResponse) => {
          const countryCode = assertDefined(Object.keys(countryResponse).at(0));
          const countrySources = countryResponse[countryCode];
          const mapped = countrySources.map(mapWatchNowSourceResponse);

          map.set(countryCode, mapped);
          return map;
        }, new Map<string, WatchNowSource[]>());
    });
}

const watchNowSourcesQueryKey = () => ['watchNowSources'] as const;
export const watchNowSourcesQuery = (
  params: WatchNowSourcesParams,
) => ({
  queryKey: watchNowSourcesQueryKey(),
  queryFn: () => watchNowSourcesRequest(params),
});
