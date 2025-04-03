import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
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
    });
}

export const showWatchersQuery = defineQuery({
  key: 'showWatchers',
  request: showWatchersRequest,
  mapper: (response) => response.body.map(mapToUserProfile),
  dependencies: (params) => [params.slug],
  invalidations: [],
  schema: UserProfileSchema.array(),
  ttl: time.minutes(15),
});
