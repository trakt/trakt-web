import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { FollowingActivity } from '$lib/requests/models/FollowingActivity.ts';
import type { Season } from '$lib/requests/models/Season.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import type { TodayMilestone } from './TodayMilestone.ts';

type FollowingComment = Extract<
  FollowingActivity['detail'],
  { action: 'comment' }
>['comment'];

export type TodayFriendAction = Readonly<{
  key: string;
  kind: FollowingActivity['detail']['action'];
  target: FollowingActivity['target']['type'];
  user: UserProfile;
  activityAt: Date;
  rating: number | null;
  comment: FollowingComment | null;
  episode: EpisodeEntry | null;
  episodeCount: number;
  season: Season | null;
  milestone: TodayMilestone | null;
}>;
