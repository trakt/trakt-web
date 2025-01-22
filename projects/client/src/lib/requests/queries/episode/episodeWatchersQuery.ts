import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapWatcherResponseToActiveWatcher } from '$lib/requests/_internal/mapWatcherResponseToActiveWatcher.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { ActiveWatcherSchema } from '../../models/ActiveWatcher.ts';

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
        season,
        episode,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch active episode watchers');
      }

      return response.body;
    });
}

export const episodeWatchersQuery = defineQuery({
  key: 'episodeWatchers',
  request: episodeWatchersRequest,
  mapper: (watchers) => watchers.map(mapWatcherResponseToActiveWatcher),
  dependencies: (params) => [params.slug, params.season, params.episode],
  invalidations: [],
  schema: ActiveWatcherSchema.array(),
});
