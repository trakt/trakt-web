import { defineQuery } from "$lib/features/query/defineQuery.ts";
import { mapToUserProfile } from "$lib/requests/_internal/mapToUserProfile.ts";
import { api, type ApiParams } from "$lib/requests/api.ts";
import { UserProfileSchema } from "$lib/requests/models/UserProfile.ts";
import { time } from "$lib/utils/timing/time.ts";
import type {
  FollowerResponse,
  MovieActivityHistoryResponse,
  ProfileResponse,
} from "@trakt/api";
import { z } from "zod";

type MovieNetworkWatchersParams = {
  slug: string;
  id: number;
  enabled?: boolean;
} & ApiParams;

const MAX_FOLLOWING_TO_CHECK = 10;

const request = async ({ fetch, id }: MovieNetworkWatchersParams) => {
  const followingResponse = await api({ fetch }).users.following({
    params: { id: "me" },
    query: { extended: "full,images" },
  });

  const following = (followingResponse.body as FollowerResponse[]) ?? [];

  const results = await Promise.all(
    following
      .slice(0, MAX_FOLLOWING_TO_CHECK)
      .map(async (follower: FollowerResponse) => {
        const user = follower?.user;
        if (!user) return { user: undefined, hasWatched: false };

        const userSlug = user.ids?.slug ?? user.username;
        if (!userSlug) return { user, hasWatched: false };

        try {
          const historyResponse = await api({ fetch }).users.history.movie({
            params: {
              id: userSlug,
              item_id: `${id}`,
            },
            query: { extended: "full" },
          });

          const body = (historyResponse.body as MovieActivityHistoryResponse[]) ?? [];

          return {
            user,
            hasWatched: body.length > 0,
          };
        } catch {
          return { user, hasWatched: false };
        }
      }),
  );

  const watchers = results
    .filter(
      (r): r is { hasWatched: boolean; user: ProfileResponse } => Boolean(r.hasWatched && r.user),
    )
    .map((r) => mapToUserProfile(r.user));

  return { body: watchers, status: 200 };
};

export const movieNetworkWatchersQuery = defineQuery({
  key: "movieNetworkWatchers",
  request,
  dependencies: (params) => [params.slug, params.id],
  invalidations: [],
  mapper: (response) => response.body,
  schema: z.array(UserProfileSchema),
  ttl: time.minutes(15),
  enabled: (params) => Boolean(params.enabled && params.id),
});
