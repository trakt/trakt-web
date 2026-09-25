import type { YouTubeSpecial } from '$lib/requests/models/YouTubeSpecial.ts';
import type { YouTubeSpecialOption } from '../models/YouTubeSpecialOption.ts';

export function mapToYouTubeSpecialOption(
  youtubeSpecial?: YouTubeSpecial | Nil,
): YouTubeSpecialOption | Nil {
  if (!youtubeSpecial) {
    return null;
  }

  return {
    key: 'youtube-special',
    type: 'youtube-special',
    source: 'youtube',
    link: youtubeSpecial.link,
    isOfficial: youtubeSpecial.source === 'official',
  };
}
