import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

const RewatchingShowResponseSchema = z.object({
  hidden_at: z.string().datetime().nullish(),
  type: z.literal('show'),
  show: z.object({
    ids: z.object({
      trakt: z.number(),
    }),
  }),
});

const CurrentUserRewatchingResponseSchema = z.array(
  RewatchingShowResponseSchema,
);

export const UserRewatchingSchema = z.object({
  shows: z.set(z.number()),
});

export type UserRewatching = z.infer<typeof UserRewatchingSchema>;

const currentUserRewatchingRequest = async ({ fetch }: ApiParams) => {
  const response = await rawApiFetch({
    fetch,
    path: '/users/hidden/progress_watched_reset?type=show&limit=1000',
  });

  if (!response.ok) {
    return { body: [], status: 200 };
  }

  return {
    body: CurrentUserRewatchingResponseSchema.parse(await response.json()),
    status: 200,
  };
};

export const currentUserRewatchingQuery = defineQuery({
  key: 'currentUserRewatching',
  invalidations: [
    InvalidateAction.Rewatching('show'),
  ],
  dependencies: [],
  request: currentUserRewatchingRequest,
  mapper: (response) => ({
    shows: new Set(response.body.map((entry) => entry.show.ids.trakt)),
  }),
  schema: UserRewatchingSchema,
  ttl: time.minutes(5),
});
