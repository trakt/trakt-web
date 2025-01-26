import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapWatcherResponseToActiveWatcher } from '$lib/requests/_internal/mapWatcherResponseToActiveWatcher.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { ActiveWatcherSchema } from '../../models/ActiveWatcher.ts';

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
  mapper: (watchers) => watchers.map(mapWatcherResponseToActiveWatcher),
  dependencies: (params) => [params.slug],
  invalidations: [],
  schema: ActiveWatcherSchema.array(),
  ttl: time.minutes(15),
});
