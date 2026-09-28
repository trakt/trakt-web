import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import type { TodayFriendAction } from './TodayFriendAction.ts';
import type { TodayMedia } from './TodayMedia.ts';
import type { TodayMilestone } from './TodayMilestone.ts';

export type TodayTitleStory = Readonly<{
  key: string;
  media: TodayMedia;
  actions: ReadonlyArray<TodayFriendAction>;
  users: ReadonlyArray<UserProfile>;
  averageRating: number | null;
  milestone: TodayMilestone | null;
  latestAt: Date;
}>;
