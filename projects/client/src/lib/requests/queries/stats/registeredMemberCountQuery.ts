import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import {
  type RegisteredMemberCount,
  RegisteredMemberCountSchema,
} from '$lib/requests/models/RegisteredMemberCount.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

const POLL_INTERVAL = time.seconds(10);

// `/v3/stats/users` is not published in `@trakt/api` yet, so the wire shape is
// validated locally. Drop this schema once the SDK exposes the endpoint.
const RegisteredMemberCountResponseSchema = z.object({
  registered: z.object({
    total: z.number().int(),
    updated_at: z.string().datetime(),
    rate_per_day: z.number(),
  }),
});

type RegisteredMemberCountResponse = z.infer<
  typeof RegisteredMemberCountResponseSchema
>;

const mapToRegisteredMemberCount = (
  { registered }: RegisteredMemberCountResponse,
): RegisteredMemberCount => ({
  total: registered.total,
  anchoredAt: Date.parse(registered.updated_at),
  ratePerDay: registered.rate_per_day,
});

const registeredMemberCountRequest = async ({ fetch }: ApiParams) => {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/stats/users',
    // Public figure: no Bearer token, so a 401 can never tear down the session
    // of a signed-in visitor.
    authenticated: false,
  });

  return response.ok
    ? {
      body: RegisteredMemberCountResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: undefined, status: 200 };
};

export const registeredMemberCountQuery = defineQuery({
  key: 'registeredMemberCount',
  invalidations: [],
  dependencies: [],
  request: registeredMemberCountRequest,
  mapper: ({ body }) => body ? mapToRegisteredMemberCount(body) : null,
  schema: RegisteredMemberCountSchema.nullable(),
  // Staleness and poll cadence are deliberately the same value: the endpoint is
  // uncached and moves between requests, and the counter interpolates the digits
  // in between, so there is no reason to poll harder than it goes stale.
  ttl: POLL_INTERVAL,
  refetchInterval: POLL_INTERVAL,
  refetchOnWindowFocus: true,
  retry: 1,
});
