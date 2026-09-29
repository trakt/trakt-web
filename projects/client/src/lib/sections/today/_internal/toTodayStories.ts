import type { FollowingActivity } from '$lib/requests/models/FollowingActivity.ts';
import type { TodayForYouItem } from '../models/TodayForYouItem.ts';
import { toStoryGroups } from './toStoryGroups.ts';
import { toTitleStories } from './toTitleStories.ts';

type ToTodayStoriesParams = {
  activities: ReadonlyArray<FollowingActivity>;
  forYou: ReadonlyArray<TodayForYouItem>;
};

export function toTodayStories({ activities, forYou }: ToTodayStoriesParams) {
  const titles = toTitleStories(activities);

  return {
    titles,
    forYou,
    groups: toStoryGroups({ forYou, titles }),
  };
}
