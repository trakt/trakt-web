import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import { time } from '$lib/utils/timing/time.ts';

type MovieWatchersParams = { slug: string } & ApiParams;

export function movieWatchersRequest(
  { fetch, slug }: MovieWatchersParams,
) {
  return api({ fetch })
    .movies
    .watching({
      params: {
        id: slug,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch active movie watchers');
      }

      return response.body;
    });
}

export const movieWatchersQuery = defineQuery({
  key: 'movieWatchers',
  request: movieWatchersRequest,
  mapper: (users) => users.map(mapToUserProfile),
  dependencies: (params) => [params.slug],
  invalidations: [],
  schema: UserProfileSchema.array(),
  ttl: time.minutes(15),
});
