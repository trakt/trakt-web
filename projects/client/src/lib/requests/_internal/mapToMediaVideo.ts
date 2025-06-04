import { type MediaVideo } from '$lib/requests/models/MediaVideo.ts';
import { checksum } from '$lib/utils/string/checksum.ts';
import type { VideoResponse } from '@trakt/api';

// FIXME: figure out why the response type is not the enum
function mapToVideoType(type: string): MediaVideo['type'] {
  switch (type) {
    case 'trailer':
    case 'clip':
    case 'teaser':
    case 'featurette':
    case 'recap':
    case 'behind the scenes':
    case 'opening credits':
      return type as MediaVideo['type'];
    default:
      throw new Error(`Unknown video type: ${type}`);
  }
}
export function mapToMediaVideo(
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
    type: mapToVideoType(video.type),
    url: video.url,
    thumbnail,
    publishedAt: new Date(video.published_at),
  };
}
