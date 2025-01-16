import type { ShowTrendingResponse } from '$lib/api.ts';
import type { Paginatable } from '$lib/models/Paginatable.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { type EpisodeCount } from '$lib/requests/models/EpisodeCount.ts';
import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapShowResponseToShowSummary } from '../../_internal/mapShowResponseToShowSummary.ts';

export type TrendingShow =
  & {
    watchers: number;
  }
  & ShowSummary
  & EpisodeCount;

type ShowTrendingParams = {
  page?: number;
  limit?: number;
} & ApiParams;

export function mapResponseToTrendingShows({
  watchers,
  show,
}: ShowTrendingResponse): TrendingShow {
  return {
    watchers,
    episode: {
      count: show.aired_episodes ?? NaN,
    },
    ...mapShowResponseToShowSummary(show),
  };
}

function showTrendingRequest(
  { fetch, page = 1, limit = DEFAULT_PAGE_SIZE }: ShowTrendingParams,
): Promise<Paginatable<TrendingShow>> {
  return api({ fetch })
    .shows
    .trending({
      query: {
        extended: 'full,cloud9',
        limit,
        page,
      },
    })
    .then(({ status, body, headers }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch trending shows');
      }

      return {
        entries: body.map(mapResponseToTrendingShows),
        page: extractPageMeta(headers),
      };
    });
}

const showTrendingQueryKey = (params: ShowTrendingParams) =>
  ['showTrending', params.limit, params.page] as const;
export const showTrendingQuery = (
  params: ShowTrendingParams = {},
) => ({
  queryKey: showTrendingQueryKey(params),
  queryFn: () => showTrendingRequest(params),
});
