import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaRatingSchema } from '$lib/requests/models/MediaRating.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaRating } from '../../_internal/mapToMediaRating.ts';

type MovieRatingParams = { slug: string } & ApiParams;

const movieRatingRequest = (
  { fetch, slug }: MovieRatingParams,
) =>
  api({ fetch })
    .movies
    .ratings({
      params: {
        id: slug,
      },
      query: {
        extended: 'all',
      },
    });

export const movieRatingQuery = defineQuery({
  key: 'movieRating',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: movieRatingRequest,
  mapper: (response) => mapToMediaRating(response.body),
  schema: MediaRatingSchema,
  ttl: time.hours(6),
});
