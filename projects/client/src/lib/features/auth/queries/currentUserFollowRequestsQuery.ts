import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

const UserFollowRequestSchema = z.object({
  id: z.number(),
  requestedAt: z.date(),
  user: UserProfileSchema,
});

export type UserFollowRequest = z.infer<typeof UserFollowRequestSchema>;

type CurrentUserFollowRequestsParams = {
  enabled?: boolean;
} & ApiParams;

const currentUserFollowRequestsRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .requests
    .follow({
      query: {
        extended: 'full',
      },
    });

export const currentUserFollowRequestsQuery = defineQuery({
  key: 'currentUserFollowRequests',
  request: currentUserFollowRequestsRequest,
  invalidations: [InvalidateAction.User.Follow],
  dependencies: [],
  mapper: (response) =>
    response.body.map((request) => ({
      id: request.id,
      requestedAt: new Date(request.requested_at),
      user: mapToUserProfile(request.user),
    })),
  schema: z.array(UserFollowRequestSchema),
  ttl: time.minutes(15),
  enabled: (params: CurrentUserFollowRequestsParams) => params.enabled ?? true,
});
