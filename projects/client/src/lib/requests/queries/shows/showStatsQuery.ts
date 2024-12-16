import type { MediaStats } from '$lib/models/MediaStats.ts';
import { mapStatsResponseToMediaStats } from '$lib/requests/_internal/mapStatsResponseToMediaStats.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type ShowStatsQuery = { slug: string } & ApiParams;

export function showStatsRequest(
  { fetch, slug }: ShowStatsQuery,
): Promise<MediaStats> {
  return api({ fetch })
    .shows
    .stats({
      params: {
        id: slug,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch up show stats');
      }

      return mapStatsResponseToMediaStats(body);
    });
}

export const showStatsQueryKey = (id: string) => ['showStats', id] as const;
export const showStatsQuery = (
  params: ShowStatsQuery,
) => ({
  queryKey: showStatsQueryKey(params.slug),
  queryFn: () => showStatsRequest(params),
});
