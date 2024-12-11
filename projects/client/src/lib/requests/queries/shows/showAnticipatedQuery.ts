import type { ShowAnticipatedResponse, ShowResponse } from '$lib/api.ts';
import { type EpisodeCount } from '$lib/requests/models/EpisodeCount.ts';
import { type ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/queries/shows/_internal/mapShowResponseToShowSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

export type AnticipatedShow =
  & {
    score: number;
  }
  & ShowSummary
  & Partial<EpisodeCount>;

type ShowAnticipatedParams = {
  page?: number;
  limit?: number;
} & ApiParams;

function mapShowResponseToEpisodeCount(show: ShowResponse) {
  const { aired_episodes } = show;

  if (!aired_episodes || aired_episodes === 0) {
    return {};
  }

  return { episode: { count: aired_episodes } };
}

export function mapResponseToAnticipatedShow(
  shows: ShowAnticipatedResponse,
): AnticipatedShow[] {
  return shows.map(({ show, list_count }) => ({
    score: list_count,
    ...mapShowResponseToShowSummary(show),
    ...mapShowResponseToEpisodeCount(show),
  }));
}

function showAnticipatedRequest(
  { fetch, limit, page = 1 }: ShowAnticipatedParams,
): Promise<AnticipatedShow[]> {
  return api({ fetch })
    .shows
    .anticipated({
      query: {
        extended: 'full,cloud9',
        page,
        limit,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch anticipated shows');
      }

      return mapResponseToAnticipatedShow(body);
    });
}

const showAnticipatedQueryKey = ['showAnticipated'] as const;
export const showAnticipatedQuery = (
  params: ShowAnticipatedParams = {},
) => ({
  queryKey: showAnticipatedQueryKey,
  queryFn: () => showAnticipatedRequest(params),
});
