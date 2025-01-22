import { defineQuery } from '$lib/features/query/defineQuery.ts';
import {
  type WatchNowSource,
  WatchNowSourceSchema,
} from '$lib/requests/models/WatchNowSources.ts';
import { toMap } from '$lib/utils/array/toMap.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { WatchNowSourceResponse } from '@trakt/api';
import { z } from 'zod';
import { api, type ApiParams } from '../../_internal/api.ts';

type WatchNowSourcesParams = ApiParams;
const WatchNowSourceListSchema = z.map(
  z.string(),
  WatchNowSourceSchema.array(),
);

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

function extractCountryCode(
  response: Record<string, unknown>,
) {
  return assertDefined(Object.keys(response).at(0));
}

const watchNowSourcesRequest = (
  { fetch }: WatchNowSourcesParams,
) =>
  api({ fetch })
    .watchnow
    .sources()
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch watch now sources');
      }

      return response.body;
    });

export const watchNowSourcesQuery = defineQuery({
  key: 'watchNowSources',
  invalidations: [],
  dependencies: () => [],
  request: watchNowSourcesRequest,
  mapper: (body) =>
    toMap(body, (response) => {
      const countryCode = extractCountryCode(response);
      const countrySources = response[countryCode];

      return countrySources.map(mapWatchNowSourceResponse);
    }, (_, entry) => extractCountryCode(entry)),
  schema: WatchNowSourceListSchema,
});
