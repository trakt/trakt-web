import type { RecommendedShowResponse } from '$lib/api.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { authHeader } from '../../_internal/authHeader.ts';

export type RecommendedShow = {
  id: number;
  slug: string;
  runtime: number;
  title: string;
  episode: {
    count: number;
  };
  poster: {
    url: string;
  };
};

type RecommendedShowsParams = ApiParams;

function mapResponseToRecommendedShow(
  show: RecommendedShowResponse[0],
): RecommendedShow {
  return {
    id: show.ids.trakt,
    slug: show.ids.slug,
    title: show.title,
    episode: {
      count: show.aired_episodes!,
    },
    runtime: show.runtime! * show.aired_episodes!,
    poster: {
      url: prependHttps(
        show.images?.poster.at(1) ??
          show.images?.poster.at(0),
      )!,
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
      extraHeaders: {
        ...authHeader(),
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

const recommendedShowsQueryKey = ['recommendedShows'] as const;
export const recommendedShowsQuery = (
  params: RecommendedShowsParams = {},
) => ({
  queryKey: recommendedShowsQueryKey,
  queryFn: () => recommendShowsRequest(params),
});
