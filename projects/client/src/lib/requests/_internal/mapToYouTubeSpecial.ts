import type { YouTubeSpecial } from '../models/YouTubeSpecial.ts';
import type { YouTubeSpecialResponse } from '../models/YouTubeSpecialResponse.ts';

export function mapToYouTubeSpecial(
  response?: YouTubeSpecialResponse,
): YouTubeSpecial | Nil {
  if (!response) {
    return null;
  }

  return {
    videoId: response.videoId,
    title: response.title,
    channel: response.channel,
    durationSeconds: response.durationSeconds,
    source: response.source ?? 'official',
    link: `https://www.youtube.com/watch?v=${response.videoId}`,
  };
}
