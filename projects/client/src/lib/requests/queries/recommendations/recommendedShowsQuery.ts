import type { RecommendedShowResponse } from '$lib/api.ts';
import { type EpisodeCount } from '$lib/requests/models/EpisodeCount.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaSummary } from '$lib/requests/models/MediaSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapShowResponseToShowSummary } from '../../_internal/mapShowResponseToShowSummary.ts';

export type RecommendedShow = MediaSummary & EpisodeCount;

type RecommendedShowsParams = ApiParams;

function mapResponseToRecommendedShow(
  show: RecommendedShowResponse[0],
): RecommendedShow {
  return {
    ...mapShowResponseToShowSummary(show),
    episode: {
      count: show.aired_episodes!,
    },
  };
}

function recommendShowsRequest(
  { fetch }: RecommendedShowsParams = {},
): Promise<RecommendedShow[]> {
  return api({ fetch })
    .recommendations
    .shows
    .recommend({
      query: {
        extended: 'full,cloud9',
        ignore_collected: true,
        ignore_watchlisted: true,
        limit: 35,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error(
          'The recommended shows, like elusive phantoms, refuse to materialize.',
        );
      }

      return body.map(mapResponseToRecommendedShow);
    });
}

const recommendedShowsQueryKey = [
  'recommendedShows',
  InvalidateAction.MarkAsWatched('show'),
  InvalidateAction.MarkAsWatched('episode'),
] as const;
export const recommendedShowsQuery = (
  params: RecommendedShowsParams = {},
) => ({
  queryKey: recommendedShowsQueryKey,
  queryFn: () => recommendShowsRequest(params),
});
