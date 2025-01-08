import type { ActiveWatcher } from '$lib/models/ActiveWatcher.ts';
import { mapWatcherResponseToActiveWatcher } from '$lib/requests/_internal/mapWatcherResponseToActiveWatcher.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type MovieWatchersQuery = { slug: string } & ApiParams;

export function movieWatchersRequest(
  { fetch, slug }: MovieWatchersQuery,
): Promise<ActiveWatcher[]> {
  return api({ fetch })
    .movies
    .watching({
      params: {
        id: slug,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch active movie watchers');
      }

      return body.map(mapWatcherResponseToActiveWatcher);
    });
}

export const movieWatchersQueryKey = (id: string) =>
  ['movieWatchers', id] as const;
export const movieWatchersQuery = (
  params: MovieWatchersQuery,
) => ({
  queryKey: movieWatchersQueryKey(params.slug),
  queryFn: () => movieWatchersRequest(params),
});
