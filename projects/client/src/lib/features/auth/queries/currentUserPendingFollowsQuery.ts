import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

const currentUserPendingFollowsRequest = ({ fetch }: ApiParams) =>
  api({ fetch })
    .users
    .requests
    .following();

export const currentUserPendingFollowsQuery = defineQuery({
  key: 'currentUserPendingFollows',
  request: currentUserPendingFollowsRequest,
  invalidations: [InvalidateAction.User.Follow],
  dependencies: [],
  mapper: (response) =>
    response.body.map((request) => mapToUserProfile(request.user)),
  schema: z.array(UserProfileSchema),
  ttl: time.hours(12),
});
