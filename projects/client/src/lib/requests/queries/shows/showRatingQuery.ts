import type { MediaRating } from '$lib/models/MediaRating.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapRatingResponseToMediaRating } from '../../_internal/mapRatingResponseToMediaRating.ts';

type ShowRatingParams = { slug: string } & ApiParams;

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

      return mapRatingResponseToMediaRating(body);
    });
}

export const showRatingQueryKey = (id: string) => ['showRating', id] as const;
export const showRatingQuery = (
  params: ShowRatingParams,
) => ({
  queryKey: showRatingQueryKey(params.slug),
  queryFn: () => showRatingRequest(params),
});
