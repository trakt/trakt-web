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
    });

export const showStudiosQuery = defineQuery({
  key: 'showStudios',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showStudiosRequest,
  mapper: (response) => response.body.map(mapToMediaStudio),
  schema: MediaStudioSchema.array(),
  ttl: time.days(7),
});
