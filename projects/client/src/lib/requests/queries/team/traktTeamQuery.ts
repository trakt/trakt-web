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
    }).then((response) => {
      /**
       * FIXME: @seferturan these should return 403 not 401
       * talk to @rudf0rd about this
       */
      if (response.status === 401) {
        return { status: 200, body: [], headers: response.headers };
      }

      return response;
    });

export const traktTeamQuery = defineQuery({
  key: 'traktTeam',
  invalidations: [],
  dependencies: [],
  request: traktTeamRequest,
  mapper: (response) => response.body.map(({ user }) => mapToUserProfile(user)),
  schema: UserProfileSchema.array(),
  ttl: time.days(30),
});
