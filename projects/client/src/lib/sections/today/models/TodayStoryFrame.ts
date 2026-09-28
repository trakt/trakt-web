import type { TodayForYouItem } from './TodayForYouItem.ts';
import type { TodayFriendAction } from './TodayFriendAction.ts';
import type { TodayTitleStory } from './TodayTitleStory.ts';

export type TodayStoryFrame =
  | Readonly<{ key: string; type: 'for-you'; item: TodayForYouItem }>
  | Readonly<{ key: string; type: 'summary'; story: TodayTitleStory }>
  | Readonly<{
    key: string;
    type: 'friend';
    story: TodayTitleStory;
    action: TodayFriendAction;
  }>;
