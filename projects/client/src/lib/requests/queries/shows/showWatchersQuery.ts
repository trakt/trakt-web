import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapUserProfile.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import { time } from '$lib/utils/timing/time.ts';

type ShowWatchersParams = { slug: string } & ApiParams;

export function showWatchersRequest(
  { fetch, slug }: ShowWatchersParams,
) {
  return api({ fetch })
    .shows
    .watching({
      params: {
        id: slug,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch active show watchers');
      }

      return response.body;
    });
}

export const showWatchersQuery = defineQuery({
  key: 'showWatchers',
  request: showWatchersRequest,
  mapper: (users) => users.map(mapToUserProfile),
  dependencies: (params) => [params.slug],
  invalidations: [],
  schema: UserProfileSchema.array(),
  ttl: time.minutes(15),
});
