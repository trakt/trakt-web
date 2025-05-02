import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaVideoSchema } from '$lib/requests/models/MediaVideo.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaVideo } from '../../_internal/mapToMediaVideo.ts';

type ShowVideosParams = {
  slug: string;
} & ApiParams;

const showVideoRequest = (
  { fetch, slug }: ShowVideosParams,
) =>
  api({ fetch })
    .shows
    .videos({
      params: {
        id: slug,
      },
    });

export const showVideosQuery = defineQuery({
  key: 'showVideos',
  invalidations: [],
  dependencies: (params) => [
    params.slug,
  ],
  request: showVideoRequest,
  mapper: (response) =>
    response.body
      .filter((video) => video.site === 'youtube')
      .map(mapToMediaVideo),
  schema: MediaVideoSchema.array(),
  ttl: time.days(7),
});
