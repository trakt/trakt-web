import type { TodayFriendAction } from './TodayFriendAction.ts';
import type { TodayMedia } from './TodayMedia.ts';

export type TodayPersonAction =
  & TodayFriendAction
  & Readonly<{
    media: TodayMedia;
  }>;
