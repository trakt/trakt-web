import type { ShowTrendingResponse } from '$lib/api.ts';
import { type EpisodeCount } from '$lib/requests/models/EpisodeCount.ts';
import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';
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
  { fetch, page = 1, limit = 10 }: ShowTrendingParams,
): Promise<TrendingShow[]> {
  return api({ fetch })
    .shows
    .trending({
      query: {
        extended: 'full,cloud9',
        limit,
        page,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch trending shows');
      }

      return body.map(mapResponseToTrendingShows);
    });
}

const showTrendingQueryKey = ['showTrending'] as const;
export const showTrendingQuery = (
  params: ShowTrendingParams = {},
) => ({
  queryKey: showTrendingQueryKey,
  queryFn: () => showTrendingRequest(params),
});
