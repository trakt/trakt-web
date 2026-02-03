import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { mapToUserProfile } from '../../_internal/mapToUserProfile.ts';
import { UserProfileSchema } from '../../models/UserProfile.ts';

type FollowersParams = { slug: string } & ApiParams;

const followersRequest = (
  { fetch, slug }: FollowersParams,
) =>
  api({ fetch })
    .users
    .followers({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,vip',
      },
    });

export const followersQuery = defineQuery({
  key: 'followers',
  invalidations: [],
  dependencies: (
    params: FollowersParams,
  ) => [params.slug],
  request: followersRequest,
  mapper: (response) => {
    /**
     * FIXME: remove once Trakt API returns unique followers
     */
    const profiles = response.body.map((follower) =>
      mapToUserProfile(follower.user)
    );
    const uniqueProfiles = Array.from(
      new Map(profiles.map((profile) => [profile.slug, profile])).values(),
    );
    return uniqueProfiles;
  },
  schema: z.array(UserProfileSchema),
  ttl: time.hours(3),
});
