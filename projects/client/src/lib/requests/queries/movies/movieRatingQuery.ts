import type { MovieRatingsResponse } from '$lib/api.ts';
import type { MediaRating } from '$lib/models/MediaRating.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type MovieRatingParams = { slug: string } & ApiParams;

export function mapResponseToMovieRating(
  ratings: MovieRatingsResponse,
): MediaRating {
  return {
    tmdb: {
      rating: ratings.tmdb?.rating ?? 0,
      votes: ratings.tmdb?.votes ?? 0,
    },
    rotten: {
      critic: ratings.rotten_tomatoes?.rating ?? 0,
      audience: ratings.rotten_tomatoes?.user_rating ?? 0,
    },
    imdb: {
      rating: ratings.imdb?.rating ?? 0,
      votes: ratings.imdb?.votes ?? 0,
    },
    metacritic: ratings.metascore?.rating ?? 0,
  };
}

export function movieRatingRequest(
  { fetch, slug }: MovieRatingParams,
): Promise<MediaRating> {
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
  queryFn: () => movieRatingRequest(params),
});
