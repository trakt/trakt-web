import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

export const UserDroppedHistorySchema = z.object({
  shows: z.set(z.number()),
});

export type UserDroppedHistory = z.infer<typeof UserDroppedHistorySchema>;

const currentUserDroppedRequest = async ({ fetch }: ApiParams) => {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/users/me/dropped/minimal',
  });

  return response.ok
    ? { body: (await response.json()) as number[], status: 200 }
    : { body: [] as number[], status: 200 };
};

export const currentUserDroppedQuery = defineQuery({
  key: 'currentUserDropped',
  invalidations: [
    InvalidateAction.Drop('show'),
  ],
  dependencies: [],
  request: currentUserDroppedRequest,
  mapper: (response) => ({
    shows: new Set(response.body),
  }),
  schema: UserDroppedHistorySchema,
  ttl: time.hours(3),
});
