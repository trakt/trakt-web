import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaVideoSchema } from '$lib/requests/models/MediaVideo.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaVideo } from '../../_internal/mapToMediaVideo.ts';

type MovieVideosParams = {
  slug: string;
} & ApiParams;

const movieVideoRequest = (
  { fetch, slug }: MovieVideosParams,
) =>
  api({ fetch })
    .movies
    .videos({
      params: {
        id: slug,
      },
    });

export const movieVideosQuery = defineQuery({
  key: 'movieVideos',
  invalidations: [],
  dependencies: (params) => [
    params.slug,
  ],
  request: movieVideoRequest,
  mapper: (response) =>
    response.body
      .filter((video) => video.site === 'youtube')
      .map(mapToMediaVideo)
      .toSorted((a, b) => {
        return (
          new Date(a.publishedAt).getTime() -
          new Date(b.publishedAt).getTime()
        );
      }),
  schema: MediaVideoSchema.array(),
  ttl: time.days(7),
});
