import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapWatcherResponseToActiveWatcher } from '$lib/requests/_internal/mapWatcherResponseToActiveWatcher.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { ActiveWatcherSchema } from '../../models/ActiveWatcher.ts';

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

export const showWatchersQuery = await defineQuery({
  key: 'showWatchers',
  request: showWatchersRequest,
  mapper: (watchers) => watchers.map(mapWatcherResponseToActiveWatcher),
  dependencies: (params) => [params.slug],
  invalidations: [],
  schema: ActiveWatcherSchema.array(),
});
