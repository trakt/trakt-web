import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { mapToUserProfile } from '../../_internal/mapToUserProfile.ts';
import { UserProfileSchema } from '../../models/UserProfile.ts';

type BlockedUsersParams = ApiParams;

const blockedUsersRequest = ({ fetch }: BlockedUsersParams) =>
  api({ fetch })
    .users
    .blocked();

export const blockedUsersQuery = defineQuery({
  key: 'blockedUsers',
  invalidations: [InvalidateAction.User.Block],
  dependencies: [],
  request: blockedUsersRequest,
  mapper: (response) =>
    response.body.map((entry) => mapToUserProfile(entry.user)),
  schema: z.array(UserProfileSchema),
  ttl: time.hours(1),
});
