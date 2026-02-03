import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToUserProfile } from '../../_internal/mapToUserProfile.ts';
import { UserProfileSchema } from '../../models/UserProfile.ts';

const traktTeamRequest = (
  { fetch }: ApiParams,
) =>
  api({ fetch })
    .team
    .members({
      query: {
        extended: 'full,images',
      },
    });

export const traktTeamQuery = defineQuery({
  key: 'traktTeam',
  invalidations: [],
  dependencies: [],
  request: traktTeamRequest,
  mapper: (response) => response.body.map(({ user }) => mapToUserProfile(user)),
  schema: UserProfileSchema.array(),
  ttl: time.days(7),
});
