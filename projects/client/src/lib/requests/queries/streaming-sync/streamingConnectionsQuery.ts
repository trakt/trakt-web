import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { StreamingConnectionSchema } from '$lib/requests/models/StreamingConnection.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToStreamingConnection } from './_internal/mapToStreamingConnection.ts';

type StreamingConnectionsParams = ApiParams;

const streamingConnectionsRequest = (
  { fetch }: StreamingConnectionsParams,
) =>
  api({ fetch })
    .younify
    .connections();

export const streamingConnectionsQuery = defineQuery({
  key: 'streamingConnections',
  invalidations: [InvalidateAction.StreamingSync.Connection],
  dependencies: () => [],
  request: streamingConnectionsRequest,
  mapper: (response) => response.body.map(mapToStreamingConnection),
  schema: StreamingConnectionSchema.array(),
  ttl: time.minutes(5),
});
