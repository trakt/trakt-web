import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { mapToUserProfile } from '../../_internal/mapToUserProfile.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { UserProfileSchema } from '../../models/UserProfile.ts';

type FollowingParams = { slug: string } & ApiParams;

const followingRequest = (
  { fetch, slug }: FollowingParams,
) =>
  api({ fetch })
    .users
    .following({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,vip',
      },
    });

export const followingQuery = defineQuery({
  key: 'following',
  invalidations: [InvalidateAction.User.Follow],
  dependencies: (
    params: FollowingParams,
  ) => [params.slug],
  request: followingRequest,
  mapper: (response) => {
    /**
     * FIXME: remove once Trakt API returns unique followings
     */
    const profiles = response.body.map((following) =>
      mapToUserProfile(following.user)
    );
    const uniqueProfiles = Array.from(
      new Map(profiles.map((profile) => [profile.slug, profile])).values(),
    );
    return uniqueProfiles;
  },
  schema: z.array(UserProfileSchema),
  ttl: time.days(1),
});
