import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import { time } from '$lib/utils/timing/time.ts';

type UserProfileParams = { slug: string } & ApiParams;

const userProfileRequest = (
  { fetch, slug }: UserProfileParams,
) =>
  api({ fetch })
    .users
    .profile({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,vip',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch user profile');
      }

      return response.body;
    });

export const userProfileQuery = defineQuery({
  key: 'userProfile',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: userProfileRequest,
  mapper: mapToUserProfile,
  schema: UserProfileSchema,
  ttl: time.minutes(30),
});
