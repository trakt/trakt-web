import type { ActiveWatcher } from '$lib/models/ActiveWatcher.ts';
import { mapWatcherResponseToActiveWatcher } from '$lib/requests/_internal/mapWatcherResponseToActiveWatcher.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type EpisodeWatchersQuery =
  & { slug: string; season: number; episode: number }
  & ApiParams;

export function episodeWatchersRequest(
  { fetch, slug, season, episode }: EpisodeWatchersQuery,
): Promise<ActiveWatcher[]> {
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
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch active episode watchers');
      }

      return body.map(mapWatcherResponseToActiveWatcher);
    });
}

export const episodeWatchersQueryKey = (params: EpisodeWatchersQuery) =>
  ['episodeWatchers', params.slug, params.season, params.episode] as const;
export const episodeWatchersQuery = (
  params: EpisodeWatchersQuery,
) => ({
  queryKey: episodeWatchersQueryKey(params),
  queryFn: () => episodeWatchersRequest(params),
});
