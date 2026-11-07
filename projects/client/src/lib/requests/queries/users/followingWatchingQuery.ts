import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToNowPlayingItem } from '$lib/requests/_internal/mapToNowPlayingItem.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { FollowingWatchingSchema } from '$lib/requests/models/FollowingWatching.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import { profileResponseSchema, watchingResponseSchema } from '@trakt/api';
import { z } from 'zod';

const FollowingWatchingResponseSchema = z.intersection(
  watchingResponseSchema,
  z.object({ user: profileResponseSchema }),
);

type FollowingWatchingResponse = z.infer<
  typeof FollowingWatchingResponseSchema
>;

function parseEntries(body: unknown): FollowingWatchingResponse[] {
  if (!Array.isArray(body)) return [];

  return body.flatMap((entry) => {
    const parsed = FollowingWatchingResponseSchema.safeParse(entry);
    return parsed.success ? [parsed.data] : [];
  });
}

const followingWatchingRequest = async ({ fetch }: ApiParams) => {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/users/me/following/watching?extended=full,images',
  });

  return {
    status: 200 as const,
    body: response.ok ? parseEntries(await response.json()) : [],
  };
};

export const followingWatchingQuery = defineQuery({
  key: 'followingWatching',
  invalidations: [InvalidateAction.CheckIn, InvalidateAction.User.Follow],
  dependencies: () => [],
  request: followingWatchingRequest,
  mapper: (response) =>
    response.body.map((entry) => ({
      user: mapToUserProfile(entry.user),
      nowPlaying: mapToNowPlayingItem(entry),
    })),
  schema: z.array(FollowingWatchingSchema),
  ttl: time.minutes(1),
});
