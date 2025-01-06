import type { SortDirection, UpNextResponse } from '$lib/api.ts';
import type { Paginatable } from '$lib/models/Paginatable.ts';
import { mapEpisodeResponseToEpisodeEntry } from '$lib/requests/_internal/mapEpisodeResponseToEpisodeEntry.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import type { EpisodeProgressEntry } from '../../../models/EpisodeProgressEntry.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { extractPageMeta } from '../../_internal/extractPageMeta.ts';

export type UpNextEntry = EpisodeProgressEntry & {
  show: ShowSummary;
};

type UpNextParams = {
  page?: number;
  limit?: number;
  sort?: {
    by?: string;
    direction?: SortDirection;
  };
} & ApiParams;

function mapResponseToUpNextEntry(item: UpNextResponse[0]): UpNextEntry {
  const episode = item.progress.next_episode;

  return {
    show: mapShowResponseToShowSummary(item.show),
    ...mapEpisodeResponseToEpisodeEntry(episode),
    total: item.progress.aired,
    completed: item.progress.completed,
    remaining: item.progress.aired - item.progress.completed,
    minutesLeft: item.progress.stats?.minutes_left ?? 0,
  };
}

export function upNextRequest(
  { fetch, page = 1, limit, sort }: UpNextParams = {},
): Promise<Paginatable<UpNextEntry>> {
  const sortQuery = sort?.by && sort?.direction
    ? {
      sort_by: sort.by,
      sort_how: sort.direction,
    }
    : {};

  return api({ fetch })
    .sync
    .progress
    .upNext({
      query: {
        extended: 'full,cloud9',
        page,
        limit,
        include_stats: true,
        ...sortQuery,
      },
    })
    .then(({ status, body, headers }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch up next');
      }

      return {
        entries: body.map(mapResponseToUpNextEntry),
        page: extractPageMeta(headers),
      };
    });
}
export const upNextQueryKey = [
  'upNext',
  InvalidateAction.MarkAsWatched('show'),
  InvalidateAction.MarkAsWatched('episode'),
] as const;
export const upNextQuery = (
  params: UpNextParams = {},
) => ({
  queryKey: upNextQueryKey,
  queryFn: () => upNextRequest(params),
});
