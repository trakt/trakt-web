import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { ConnectedAppSchema } from '$lib/requests/models/ConnectedApp.ts';
import { time } from '$lib/utils/timing/time.ts';
import {
  type ConnectedAppResponse,
  ConnectedAppResponseSchema,
} from './_internal/ConnectedAppResponse.ts';
import { mapToConnectedApp } from './_internal/mapToConnectedApp.ts';

type ConnectedAppsParams = ApiParams;

const connectedAppsRequest = async (
  { fetch }: ConnectedAppsParams,
) => {
  const response = await rawApiFetch(
    { fetch, path: '/v3/users/me/connected-apps' },
  );

  const body = response.ok
    ? ConnectedAppResponseSchema.array().parse(await response.json())
    : [];

  return {
    body: body as ConnectedAppResponse[],
    status: response.status,
  };
};

export const connectedAppsQuery = defineQuery({
  key: 'connectedApps',
  invalidations: [],
  dependencies: () => [],
  request: connectedAppsRequest,
  mapper: (response) => response.body.map(mapToConnectedApp),
  schema: ConnectedAppSchema.array(),
  ttl: time.minutes(15),
});
