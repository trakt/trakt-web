import type { ShowAnticipatedResponse, ShowResponse } from '$lib/api.ts';
import type { Paginatable } from '$lib/models/Paginatable.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { type EpisodeCount } from '$lib/requests/models/EpisodeCount.ts';
import { type ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapShowResponseToShowSummary } from '../../_internal/mapShowResponseToShowSummary.ts';

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

export function mapResponseToAnticipatedShow({
  list_count,
  show,
}: ShowAnticipatedResponse): AnticipatedShow {
  return {
    score: list_count,
    ...mapShowResponseToShowSummary(show),
    ...mapShowResponseToEpisodeCount(show),
  };
}

function showAnticipatedRequest(
  { fetch, page = 1, limit = DEFAULT_PAGE_SIZE }: ShowAnticipatedParams,
): Promise<Paginatable<AnticipatedShow>> {
  return api({ fetch })
    .shows
    .anticipated({
      query: {
        extended: 'full,cloud9',
        page,
        limit,
      },
    })
    .then(({ status, body, headers }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch anticipated shows');
      }

      return {
        entries: body.map(mapResponseToAnticipatedShow),
        page: extractPageMeta(headers),
      };
    });
}

const showAnticipatedQueryKey = (params: ShowAnticipatedParams) =>
  ['showAnticipated', params.limit, params.page] as const;
export const showAnticipatedQuery = (
  params: ShowAnticipatedParams = {},
) => ({
  queryKey: showAnticipatedQueryKey(params),
  queryFn: () => showAnticipatedRequest(params),
});
