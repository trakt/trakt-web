import type { TodayStoryFrame } from './TodayStoryFrame.ts';
import type { TodayTitleStory } from './TodayTitleStory.ts';

export type TodayStoryGroup =
  | Readonly<{
    key: string;
    type: 'for-you';
    frames: ReadonlyArray<TodayStoryFrame>;
  }>
  | Readonly<{
    key: string;
    type: 'title';
    story: TodayTitleStory;
    frames: ReadonlyArray<TodayStoryFrame>;
  }>;
