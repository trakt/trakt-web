import type { MovieRatingsResponse } from '$lib/api.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

export type MovieRating = {
  tmdb: number;
  rotten: {
    critic: number;
    audience: number;
  };
  imdb: number;
  metacritic: number;
};

type MovieRatingParams = { slug: string } & ApiParams;

export function mapResponseToMovieRating(
  ratings: MovieRatingsResponse,
): MovieRating {
  return {
    tmdb: ratings.tmdb?.rating ?? 0,
    rotten: {
      critic: ratings.rotten_tomatoes?.rating ?? 0,
      audience: ratings.rotten_tomatoes?.user_rating ?? 0,
    },
    imdb: ratings.imdb?.rating ?? 0,
    metacritic: ratings.metascore?.rating ?? 0,
  };
}

export function upNextRequest(
  { fetch, slug }: MovieRatingParams,
): Promise<MovieRating> {
  return api({ fetch })
    .movies
    .ratings({
      params: {
        id: slug,
      },
      query: {
        extended: 'all',
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch up next');
      }

      return mapResponseToMovieRating(body);
    });
}

export const movieRatingQueryKey = (id: string) => ['movieRating', id] as const;
export const movieRatingQuery = (
  params: MovieRatingParams,
) => ({
  queryKey: movieRatingQueryKey(params.slug),
  queryFn: () => upNextRequest(params),
});
