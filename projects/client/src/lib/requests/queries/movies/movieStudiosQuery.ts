import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaStudio } from '../../_internal/mapToMediaStudio.ts';
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
    });

export const movieStudiosQuery = defineQuery({
  key: 'movieStudios',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: movieStudiosRequest,
  mapper: (response) => response.body.map(mapToMediaStudio),
  schema: MediaStudioSchema.array(),
  ttl: time.days(7),
});
