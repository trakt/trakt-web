import type { ShowRatingsResponse } from '$lib/api.ts';
import type { MediaRating } from '$lib/models/MediaRating.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type ShowRatingParams = { slug: string } & ApiParams;

export function mapResponseToShowRating(
  ratings: ShowRatingsResponse,
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

export function showRatingRequest(
  { fetch, slug }: ShowRatingParams,
): Promise<MediaRating> {
  return api({ fetch })
    .shows
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

      return mapResponseToShowRating(body);
    });
}

export const showRatingQueryKey = (id: string) => ['showRating', id] as const;
export const showRatingQuery = (
  params: ShowRatingParams,
) => ({
  queryKey: showRatingQueryKey(params.slug),
  queryFn: () => showRatingRequest(params),
});
