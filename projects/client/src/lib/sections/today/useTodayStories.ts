import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { createBulkIntlOverlay } from '$lib/features/intl-overlay/createBulkIntlOverlay.ts';
import { followingActivityTargets } from '$lib/features/intl-overlay/followingActivityTargets.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
import { useAllPagesInfiniteQuery } from '$lib/features/query/useQuery.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { FollowingActivity } from '$lib/requests/models/FollowingActivity.ts';
import type { UpNextEntry } from '$lib/requests/models/UpNextEntry.ts';
import { followingActivityQuery } from '$lib/requests/queries/users/followingActivityQuery.ts';
import { useUpNextList } from '$lib/sections/lists/progress/useUpNextList.ts';
import { useWatchList } from '$lib/sections/lists/watchlist/useWatchList.ts';
import { dedupe } from '$lib/utils/array/dedupe.ts';
import { anyTrue } from '$lib/utils/store/anyTrue.ts';
import { combineLatest, map } from 'rxjs';
import { getTodayWindow } from './_internal/getTodayWindow.ts';
import { toActivityWindow } from './_internal/toActivityWindow.ts';
import type { TodayRange } from './models/TodayRange.ts';
import { toForYouItems } from './_internal/toForYouItems.ts';
import { toTitleStories } from './_internal/toTitleStories.ts';

const TODAY_ACTIVITY_LIMIT = 250;
const TODAY_RELEASES_LIMIT = 25;

type TodayStoriesProps = FilterParams & {
  type: DiscoverMode;
  range?: TodayRange;
};

function isInMode(activity: FollowingActivity, type: DiscoverMode) {
  if (type === 'media') return true;
  const isMovie = activity.target.type === 'movie';
  return type === 'movie' ? isMovie : !isMovie;
}

function isEpisodeProgress(entry: object): entry is UpNextEntry {
  return 'show' in entry;
}

export function useTodayStories(
  { type, filter, range = getTodayWindow(new Date()) }: TodayStoriesProps,
) {
  const activityQuery = useAllPagesInfiniteQuery(
    followingActivityQuery({
      limit: TODAY_ACTIVITY_LIMIT,
      ...toActivityWindow(range),
    }),
  );
  const activityList = activityQuery.pipe(
    map(($query) =>
      dedupe(
        (entry) => entry.key,
        $query.data?.pages.flatMap((page) => page.entries) ?? [],
      )
    ),
  );
  const isActivityLoading = activityQuery.pipe(
    map(($query) =>
      $query.isPending || $query.isFetchingNextPage || $query.hasNextPage
    ),
  );
  const overlay = createBulkIntlOverlay<FollowingActivity>({
    getTargets: followingActivityTargets,
  });

  const upNext = useUpNextList({
    type,
    filter,
    sortBy: 'released',
    sortHow: 'desc',
    limit: TODAY_RELEASES_LIMIT,
  });

  const startWatching = useWatchList({
    type,
    filter,
    intent: 'start',
    sortBy: 'released',
    sortHow: 'desc',
    limit: TODAY_RELEASES_LIMIT,
  });

  const activities = activityList.pipe(
    overlay.operator,
    map(($list) => $list.filter((entry) => isInMode(entry, type))),
  );

  const forYou = combineLatest([upNext.list, startWatching.list]).pipe(
    map(([$upNext, $watchlist]) =>
      toForYouItems({
        upNext: $upNext.filter(isEpisodeProgress),
        watchlist: $watchlist,
        range,
      })
    ),
  );

  const isLoading = anyTrue([
    withOverlayLoading(isActivityLoading, overlay.intlLoading$),
    upNext.isLoading,
    startWatching.isLoading,
  ]);

  return {
    activities,
    titles: activities.pipe(map(toTitleStories)),
    forYou,
    isLoading,
  };
}
