import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaRatingSchema } from '$lib/requests/models/MediaRating.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaRating } from '../../_internal/mapToMediaRating.ts';

type ShowRatingParams = {
  slug: string;
} & ApiParams;

const showRatingRequest = (
  { fetch, slug }: ShowRatingParams,
) =>
  api({ fetch })
    .shows
    .ratings({
      params: {
        id: slug,
      },
      query: {
        extended: 'all',
      },
    });

export const showRatingQuery = defineQuery({
  key: 'showRating',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showRatingRequest,
  mapper: (response) => mapToMediaRating(response.body),
  schema: MediaRatingSchema,
  ttl: time.hours(3),
});
