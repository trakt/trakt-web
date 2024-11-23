import type { RecommendedMovieResponse } from '$lib/api.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { authHeader } from '../../_internal/authHeader.ts';

export type RecommendedMovie = {
  id: number;
  runtime: number;
  title: string;
  poster: {
    url: string;
  };
};

type RecommendedMoviesParams = ApiParams;

function mapResponseToRecommendedMovie(
  movie: RecommendedMovieResponse[0],
): RecommendedMovie {
  return {
    id: movie.ids.trakt,
    title: movie.title,
    runtime: movie.runtime!,
    poster: {
      url: prependHttps(
        movie.images?.poster.at(1) ??
          movie.images?.poster.at(0),
      )!,
    },
  };
}

function recommendMoviesRequest(
  { fetch }: RecommendedMoviesParams = {},
): Promise<RecommendedMovie[]> {
  return api({ fetch })
    .recommendations
    .movies
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
          [
            'The digital projector sputters and dies.',
            'The recommended movies remain trapped in the celluloid void.',
          ].join(' '),
        );
      }

      return body.map(mapResponseToRecommendedMovie);
    });
}

const recommendedMoviesQueryKey = ['recommendedMovies'] as const;
export const recommendedMoviesQuery = (
  params: RecommendedMoviesParams = {},
) => ({
  queryKey: recommendedMoviesQueryKey,
  queryFn: () => recommendMoviesRequest(params),
});
