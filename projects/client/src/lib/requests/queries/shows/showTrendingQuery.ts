import type { ShowTrendingResponse } from '$lib/api.ts';
import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapShowResponseToShowSummary } from './_internal/mapShowResponseToShowSummary.ts';

export type TrendingShow = ShowSummary & {
  watchers: number;
};

type ShowTrendingParams = ApiParams;

export function mapResponseToTrendingShows(
  shows: ShowTrendingResponse,
): TrendingShow[] {
  return shows.map(({ show, watchers }) => ({
    watchers: watchers,
    ...mapShowResponseToShowSummary(show),
  }));
}

function showTrendingRequest(
  { fetch }: ShowTrendingParams,
): Promise<TrendingShow[]> {
  return api({ fetch })
    .shows
    .trending({
      query: {
        extended: 'full,cloud9',
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch trending shows');
      }

      return mapResponseToTrendingShows(body);
    });
}

const showTrendingQueryKey = ['showTrending'] as const;
export const showTrendingQuery = (
  params: ShowTrendingParams = {},
) => ({
  queryKey: showTrendingQueryKey,
  queryFn: () => showTrendingRequest(params),
});
