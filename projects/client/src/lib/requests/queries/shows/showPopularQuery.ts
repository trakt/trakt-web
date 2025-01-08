import { type ShowResponse } from '$lib/api.ts';
import { type EpisodeCount } from '$lib/requests/models/EpisodeCount.ts';
import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapShowResponseToShowSummary } from '../../_internal/mapShowResponseToShowSummary.ts';

type ShowPopularParams = {
  page?: number;
  limit?: number;
} & ApiParams;

export type PopularShow = ShowSummary & EpisodeCount;

export function mapResponseToPopularShow(
  show: ShowResponse,
): PopularShow {
  return {
    episode: {
      count: show.aired_episodes!,
    },
    ...mapShowResponseToShowSummary(show),
  };
}

function showPopularRequest(
  { fetch, page = 1, limit = 10 }: ShowPopularParams,
): Promise<ShowSummary[]> {
  return api({ fetch })
    .shows
    .popular({
      query: {
        extended: 'full,cloud9',
        limit,
        page,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch popular shows');
      }

      return body.map(mapResponseToPopularShow);
    });
}

const showPopularQueryKey = ['showPopular'] as const;
export const showPopularQuery = (
  params: ShowPopularParams = {},
) => ({
  queryKey: showPopularQueryKey,
  queryFn: () => showPopularRequest(params),
});
