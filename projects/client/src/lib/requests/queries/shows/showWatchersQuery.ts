import type { ActiveWatcher } from '$lib/models/ActiveWatcher.ts';
import { mapWatcherResponseToActiveWatcher } from '$lib/requests/_internal/mapWatcherResponseToActiveWatcher.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type ShowWatchersQuery = { slug: string } & ApiParams;

export function showWatchersRequest(
  { fetch, slug }: ShowWatchersQuery,
): Promise<ActiveWatcher[]> {
  return api({ fetch })
    .shows
    .watching({
      params: {
        id: slug,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch active show watchers');
      }

      return body.map(mapWatcherResponseToActiveWatcher);
    });
}

export const showWatchersQueryKey = (id: string) =>
  ['showWatchers', id] as const;
export const showWatchersQuery = (
  params: ShowWatchersQuery,
) => ({
  queryKey: showWatchersQueryKey(params.slug),
  queryFn: () => showWatchersRequest(params),
});
