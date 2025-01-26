import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapStudioResponseToMediaStudio } from '../../_internal/mapStudioResponseToMediaStudio.ts';
import { MediaStudioSchema } from '../../models/MediaStudio.ts';

type MovieStudiosParams = {
  slug: string;
} & ApiParams;

const movieStudiosRequest = (
  { fetch, slug }: MovieStudiosParams,
) =>
  api({ fetch })
    .movies
    .studios({
      params: {
        id: slug,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch movie studios');
      }

      return response.body;
    });

export const movieStudiosQuery = defineQuery({
  key: 'movieStudios',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: movieStudiosRequest,
  mapper: (body) => body.map(mapStudioResponseToMediaStudio),
  schema: MediaStudioSchema.array(),
  ttl: time.days(30),
});
