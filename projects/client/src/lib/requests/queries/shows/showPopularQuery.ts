import { type ShowResponse } from '$lib/api.ts';
import type { Paginatable } from '$lib/models/Paginatable.ts';
import { extractPageMeta } from '$lib/requests/_internal/extractPageMeta.ts';
import { type EpisodeCount } from '$lib/requests/models/EpisodeCount.ts';
import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapShowResponseToShowSummary } from '../../_internal/mapShowResponseToShowSummary.ts';

export type PopularShow = ShowSummary & Partial<EpisodeCount>;

type ShowPopularParams = {
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

export function mapResponseToPopularShow(show: ShowResponse): PopularShow {
  return {
    ...mapShowResponseToShowSummary(show),
    ...mapShowResponseToEpisodeCount(show),
  };
}

function showPopularRequest(
  { fetch, page = 1, limit = DEFAULT_PAGE_SIZE }: ShowPopularParams,
): Promise<Paginatable<PopularShow>> {
  return api({ fetch })
    .shows
    .popular({
      query: {
        extended: 'full,cloud9',
        limit,
        page,
      },
    })
    .then(({ status, body, headers }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch popular shows');
      }

      return {
        entries: body.map(mapResponseToPopularShow),
        page: extractPageMeta(headers),
      };
    });
}

const showPopularQueryKey = (params: ShowPopularParams) =>
  ['showPopular', params.limit, params.page] as const;
export const showPopularQuery = (
  params: ShowPopularParams = {},
) => ({
  queryKey: showPopularQueryKey(params),
  queryFn: () => showPopularRequest(params),
});
