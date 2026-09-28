import type { TodayMedia } from '../models/TodayMedia.ts';
import type { TodayStoryFrame } from '../models/TodayStoryFrame.ts';

export function toFrameMedia(frame: TodayStoryFrame): TodayMedia {
  if (frame.type !== 'for-you') return frame.story.media;

  return frame.item.type === 'up-next'
    ? frame.item.entry.show
    : frame.item.media;
}
