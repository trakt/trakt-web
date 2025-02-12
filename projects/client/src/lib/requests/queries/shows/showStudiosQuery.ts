import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaStudioSchema } from '$lib/requests/models/MediaStudio.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaStudio } from '../../_internal/mapToMediaStudio.ts';

type ShowStudiosParams = {
  slug: string;
} & ApiParams;

const showStudiosRequest = (
  { fetch, slug }: ShowStudiosParams,
) =>
  api({ fetch })
    .shows
    .studios({
      params: {
        id: slug,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch show studios');
      }

      return response.body;
    });

export const showStudiosQuery = defineQuery({
  key: 'showStudios',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showStudiosRequest,
  mapper: (body) => body.map(mapToMediaStudio),
  schema: MediaStudioSchema.array(),
  ttl: time.days(30),
});
