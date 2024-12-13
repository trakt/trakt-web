import type { RecommendedMovieResponse } from '$lib/api.ts';
import { authHeader } from '$lib/features/auth/stores/authHeader.ts';
import type { MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapMovieResponseToMovieSummary } from '../../_internal/mapMovieResponseToMovieSummary.ts';

export type RecommendedMovie = MovieSummary;

type RecommendedMoviesParams = ApiParams;

function mapResponseToRecommendedMovie(
  movie: RecommendedMovieResponse[0],
): RecommendedMovie {
  return {
    ...mapMovieResponseToMovieSummary(movie),
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
