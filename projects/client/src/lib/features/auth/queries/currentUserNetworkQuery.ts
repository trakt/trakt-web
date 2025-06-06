import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import { z } from 'zod';

export const UserNetworkSchema = z.object({
  following: z.array(UserProfileSchema),
});
export type UserNetwork = z.infer<typeof UserNetworkSchema>;

const currentUserFollowingRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .following({
      params: {
        id: 'me',
      },
    });

export const currentUserNetworkQuery = defineQuery({
  key: 'currentUserNetwork',
  request: currentUserFollowingRequest,
  invalidations: [InvalidateAction.User.Follow],
  dependencies: [],
  mapper: (response) => ({
    following: response.body.map((following) =>
      mapToUserProfile(following.user)
    ),
  }),
  schema: UserNetworkSchema,
  ttl: Infinity,
});
