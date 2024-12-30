import type { MediaRating } from '$lib/models/MediaRating.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapRatingResponseToMediaRating } from '../../_internal/mapRatingResponseToMediaRating.ts';

type MovieRatingParams = { slug: string } & ApiParams;

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
        throw new Error('Failed to fetch movie rating');
      }

      return mapRatingResponseToMediaRating(body);
    });
}

export const movieRatingQueryKey = (id: string) => ['movieRating', id] as const;
export const movieRatingQuery = (
  params: MovieRatingParams,
) => ({
  queryKey: movieRatingQueryKey(params.slug),
  queryFn: () => movieRatingRequest(params),
});
