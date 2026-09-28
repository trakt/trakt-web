import type { FollowingActivity } from '$lib/requests/models/FollowingActivity.ts';
import type { TodayFilter } from '../models/TodayFilter.ts';
import type { TodayForYouItem } from '../models/TodayForYouItem.ts';
import { isActivityInFilter } from './isActivityInFilter.ts';
import { toStoryGroups } from './toStoryGroups.ts';
import { toTitleStories } from './toTitleStories.ts';

type ToFilteredStoriesParams = {
  activities: ReadonlyArray<FollowingActivity>;
  forYou: ReadonlyArray<TodayForYouItem>;
  filter: TodayFilter;
};

export function toFilteredStories(
  { activities, forYou, filter }: ToFilteredStoriesParams,
) {
  const titles = toTitleStories(
    activities.filter((activity) => isActivityInFilter(activity, filter)),
  );
  const visibleForYou = filter === 'all' || filter === 'mine' ? forYou : [];

  return {
    titles,
    forYou: visibleForYou,
    groups: toStoryGroups({ forYou: visibleForYou, titles }),
  };
}
