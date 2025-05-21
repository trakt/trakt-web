import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToUserProfile } from '$lib/requests/_internal/mapToUserProfile.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
import { time } from '$lib/utils/timing/time.ts';
type EpisodeWatchersParams =
  & { slug: string; season: number; episode: number }
  & ApiParams;

export function episodeWatchersRequest(
  { fetch, slug, season, episode }: EpisodeWatchersParams,
) {
  return api({ fetch })
    .shows
    .episode
    .watching({
      params: {
        id: slug,
        season: castNumberAsString(season),
        episode,
      },
    });
}

export const episodeWatchersQuery = defineQuery({
  key: 'episodeWatchers',
  request: episodeWatchersRequest,
  mapper: (response) => response.body.map(mapToUserProfile),
  dependencies: (params) => [params.slug, params.season, params.episode],
  invalidations: [],
  schema: UserProfileSchema.array(),
  ttl: time.minutes(15),
});
