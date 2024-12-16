import type { MediaStats } from '$lib/models/MediaStats.ts';
import { mapStatsResponseToMediaStats } from '$lib/requests/_internal/mapStatsResponseToMediaStats.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type MovieStatsQuery = { slug: string } & ApiParams;

export function movieStatsRequest(
  { fetch, slug }: MovieStatsQuery,
): Promise<MediaStats> {
  return api({ fetch })
    .movies
    .stats({
      params: {
        id: slug,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch up movie stats');
      }

      return mapStatsResponseToMediaStats(body);
    });
}

export const movieStatsQueryKey = (id: string) => ['movieStats', id] as const;
export const movieStatsQuery = (
  params: MovieStatsQuery,
) => ({
  queryKey: movieStatsQueryKey(params.slug),
  queryFn: () => movieStatsRequest(params),
});
