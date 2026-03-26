import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaVideoSchema } from '$lib/requests/models/MediaVideo.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { VideoResponse } from '@trakt/api';
import { castNumberAsString } from '../../../utils/requests/castNumberAsString.ts';
import { mapToMediaVideo } from '../../_internal/mapToMediaVideo.ts';

type ShowVideosParams = {
  slug: string;
} & ApiParams;

const showVideoRequest = (
  { fetch, slug }: ShowVideosParams,
) => {
  const showVideos = api({ fetch })
    .shows
    .videos({
      params: {
        id: slug,
      },
    });

  const allSeasonVideos = api({ fetch })
    .shows
    .season
    .videos({
      params: {
        id: slug,
        season: castNumberAsString('all'),
      },
    });

  return Promise.all([showVideos, allSeasonVideos])
    .then(([showResponse, seasonResponse]) => {
      if (
        showResponse.status !== 200 || seasonResponse.status !== 200
      ) {
        return {
          body: [],
          status: 400,
        };
      }

      return {
        body: [
          showResponse.body,
          seasonResponse.body,
        ].flat() as VideoResponse[],
        status: 200,
      };
    });
};

export const showVideosQuery = defineQuery({
  key: 'showVideos',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showVideoRequest,
  mapper: (response) => {
    const seen = new Set<string>();

    return response
      .body
      .filter((video) => video.site === 'youtube')
      .map(mapToMediaVideo)
      .filter((video) => {
        if (seen.has(video.key)) {
          return false;
        }
        seen.add(video.key);
        return true;
      })
      .toSorted((a, b) => {
        return (
          new Date(a.publishedAt).getTime() -
          new Date(b.publishedAt).getTime()
        );
      });
  },
  schema: MediaVideoSchema.array(),
  ttl: time.days(1),
});
