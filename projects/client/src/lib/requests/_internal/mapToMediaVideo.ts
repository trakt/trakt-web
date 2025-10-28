import { type MediaVideo } from '$lib/requests/models/MediaVideo.ts';
import { checksum } from '$lib/utils/string/checksum.ts';
import type { VideoResponse } from '@trakt/api';

export function mapToMediaVideo(
  video: VideoResponse,
): MediaVideo {
  // Extract YouTube video ID from the URL if it's a YouTube video
  const [_, youtubeId] = video.url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/?|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
  ) ?? [];

  const thumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  return {
    key: checksum(video.url),
    title: video.title,
    type: video.type,
    url: video.url,
    thumbnail,
    publishedAt: new Date(video.published_at),
  };
}
