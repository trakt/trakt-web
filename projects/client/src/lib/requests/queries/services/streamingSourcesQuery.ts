import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { toMap } from '$lib/utils/array/toMap.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { WatchNowSourceResponse } from '@trakt/api';
import { z } from 'zod';
import {
  type StreamingSource,
  StreamingSourceSchema,
} from '../../models/StreamingSource.ts';

type StreamingSourcesParams = ApiParams;
const StreamingSourceListSchema = z.map(
  z.string(),
  StreamingSourceSchema.array(),
);

function mapStreamingSourceResponse(
  sourceResponse: WatchNowSourceResponse,
): StreamingSource {
  return {
    source: sourceResponse.source,
    name: sourceResponse.name,
    isFree: sourceResponse.free,
    logoUrl: prependHttps(sourceResponse.images.logo),
    channelLogoUrl: prependHttps(sourceResponse.images.channel),
  };
}

function extractCountryCode(
  response: Record<string, unknown>,
) {
  return assertDefined(Object.keys(response).at(0));
}

const streamingSourcesRequest = (
  { fetch }: StreamingSourcesParams,
) =>
  api({ fetch })
    .watchnow
    .sources
    .all();

export const streamingSourcesQuery = defineQuery({
  key: 'streamingSources',
  invalidations: [],
  dependencies: () => [],
  request: streamingSourcesRequest,
  mapper: (response) =>
    toMap(response.body, (data) => {
      const countryCode = extractCountryCode(data);
      const countrySources = data[countryCode];

      return countrySources?.map(mapStreamingSourceResponse) ?? [];
    }, (_, entry) => extractCountryCode(entry)),
  schema: StreamingSourceListSchema,
  ttl: Infinity,
});
