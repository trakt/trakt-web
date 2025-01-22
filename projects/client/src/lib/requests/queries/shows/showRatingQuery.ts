import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaRatingSchema } from '$lib/requests/models/MediaRating.ts';
import { mapRatingResponseToMediaRating } from '../../_internal/mapRatingResponseToMediaRating.ts';

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
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch show rating');
      }

      return response.body;
    });

export const showRatingQuery = defineQuery({
  key: 'showRating',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showRatingRequest,
  mapper: mapRatingResponseToMediaRating,
  schema: MediaRatingSchema,
});
