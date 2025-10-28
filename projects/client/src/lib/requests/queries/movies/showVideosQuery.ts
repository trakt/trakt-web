import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaVideoSchema } from '$lib/requests/models/MediaVideo.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { VideoResponse } from '@trakt/api';
import { mapToMediaVideo } from '../../_internal/mapToMediaVideo.ts';

type ShowVideosParams = {
  slug: string;
  seasons: number[];
} & ApiParams;

const showVideoRequest = (
  { fetch, slug, seasons }: ShowVideosParams,
) => {
  const showVideos = api({ fetch })
    .shows
    .videos({
      params: {
        id: slug,
      },
    });

  const seasonVideos = seasons.map((season) =>
    api({ fetch })
      .shows
      .season
      .videos({
        params: {
          id: slug,
          season: castNumberAsString(season),
        },
      })
  );

  return Promise.all([showVideos, ...seasonVideos])
    .then((responses) => {
      const [showResponse, ...seasonResponses] = responses;

      if (
        showResponse.status !== 200 ||
        seasonResponses.some((response) =>
          response.status !== 200 && response.status !== 404
        )
      ) {
        return {
          body: [],
          status: 400,
        };
      }

      return {
        body: [
          showResponse.body,
          ...seasonResponses.map((response) => response.body),
        ].flat() as VideoResponse[],
        status: 200,
      };
    });
};

export const showVideosQuery = defineQuery({
  key: 'showVideos',
  invalidations: [],
  dependencies: (params) => [
    params.slug,
    ...params.seasons,
  ],
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
      .sort((a, b) => {
        return (
          new Date(a.publishedAt).getTime() -
          new Date(b.publishedAt).getTime()
        );
      });
  },
  schema: MediaVideoSchema.array(),
  ttl: time.days(7),
});
