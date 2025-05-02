import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import {
  type MediaVideo,
  MediaVideoSchema,
} from '$lib/requests/models/MediaVideo.ts';
import { checksum } from '$lib/utils/string/checksum.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { VideoResponse } from '@trakt/api';

type MovieVideosParams = {
  slug: string;
} & ApiParams;

function mapVideoResponse(
  video: VideoResponse,
): MediaVideo {
  // Extract YouTube video ID from the URL if it's a YouTube video
  const [_, youtubeId] = video.url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/?|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
  ) ?? [];

  const thumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  return {
    id: checksum(video.url),
    title: video.title,
    type: video.type,
    url: video.url,
    thumbnail,
  };
}

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
      .map(mapVideoResponse),
  schema: MediaVideoSchema.array(),
  ttl: time.days(7),
});
