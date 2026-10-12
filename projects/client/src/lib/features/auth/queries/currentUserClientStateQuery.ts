import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { ClientStateSchema } from '$lib/requests/models/ClientState.ts';
import { time } from '$lib/utils/timing/time.ts';

const CLIENT_STATE_TIMEOUT = time.seconds(3);

async function parseClientState(response: Response | null) {
  if (!response?.ok) return null;

  const parsed = ClientStateSchema.safeParse(
    await response.json().catch(() => null),
  );
  return parsed.success ? parsed.data : null;
}

const currentUserClientStateRequest = async ({ fetch }: ApiParams) => {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/users/me/client-state',
    init: { signal: AbortSignal.timeout(CLIENT_STATE_TIMEOUT) },
  }).catch(() => null);

  return { body: await parseClientState(response), status: 200 };
};

export const currentUserClientStateQuery = defineQuery({
  key: 'currentUserClientState',
  invalidations: [],
  dependencies: [],
  request: currentUserClientStateRequest,
  mapper: (response) => response.body,
  schema: ClientStateSchema.nullable(),
  ttl: time.minutes(15),
  retry: 0,
  refetchOnWindowFocus: true,
});
