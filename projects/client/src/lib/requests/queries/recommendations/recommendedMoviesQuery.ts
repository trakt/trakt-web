import type { RecommendedMovieResponse } from '$lib/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapMovieResponseToMovieSummary } from '../../_internal/mapMovieResponseToMovieSummary.ts';

export type RecommendedMovie = MovieSummary;

type RecommendedMoviesParams = ApiParams & { limit?: number };

function mapResponseToRecommendedMovie(
  movie: RecommendedMovieResponse[0],
): RecommendedMovie {
  return {
    ...mapMovieResponseToMovieSummary(movie),
  };
}

function recommendMoviesRequest(
  { fetch, limit = DEFAULT_PAGE_SIZE }: RecommendedMoviesParams = {},
): Promise<RecommendedMovie[]> {
  return api({ fetch })
    .recommendations
    .movies
    .recommend({
      query: {
        extended: 'full,cloud9',
        ignore_collected: true,
        ignore_watchlisted: true,
        limit,
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

const recommendedMoviesQueryKey = ({ limit }: RecommendedMoviesParams) =>
  [
    'recommendedMovies',
    InvalidateAction.MarkAsWatched('movie'),
    limit,
  ] as const;
export const recommendedMoviesQuery = (
  params: RecommendedMoviesParams = {},
) => ({
  queryKey: recommendedMoviesQueryKey(params),
  queryFn: () => recommendMoviesRequest(params),
});
