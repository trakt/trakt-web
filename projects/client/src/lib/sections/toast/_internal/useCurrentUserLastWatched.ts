import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { DismissedItem } from '$lib/features/toast/models/DismissedItem.ts';
import { useDismissals } from '$lib/features/toast/useDismissals.ts';
import {
  type MovieActivityHistory,
  movieActivityHistoryQuery,
} from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import { onMount } from 'svelte';
import { derived, writable } from 'svelte/store';
import { usePaginatedListQuery } from '../../lists/stores/usePaginatedListQuery.ts';

const RECENTLY_WATCHED_WINDOW = time.days(1);

function toLastWatchedMedia(
  activity: MovieActivityHistory,
) {
  return {
    type: 'movie' as const,
    media: activity.movie,
  };
}

export function useCurrentUserLastWatched() {
  const latestDismissal = writable<DismissedItem | null>(null);

  const { ratings } = useUser();
  const { latest, wasDismissed } = useDismissals();

  const { list } = usePaginatedListQuery(movieActivityHistoryQuery({
    slug: 'me',
    startDate: new Date(Date.now() - RECENTLY_WATCHED_WINDOW),
    limit: DEFAULT_PAGE_SIZE,
  }));

  onMount(() => {
    const unsubscribe = latest.subscribe(($latest) => {
      latestDismissal.set($latest);
    });

    return () => {
      unsubscribe();
    };
  });

  return {
    lastWatchedItem: derived(
      [list, ratings, latestDismissal],
      ([$list, $ratings, $latestDismissal]) => {
        const hasRecentlyDismissed = $latestDismissal &&
          $latestDismissal.dismissedAt > Date.now() - RECENTLY_WATCHED_WINDOW;

        if (!$ratings || hasRecentlyDismissed) {
          return null;
        }

        const unratedItem = $list.find((activity) => {
          if (wasDismissed(activity, $latestDismissal)) {
            return false;
          }

          switch (activity.type) {
            case 'movie':
              return !$ratings.movies.has(activity.movie.id);
            default:
              return false;
          }
        });

        return unratedItem ? toLastWatchedMedia(unratedItem) : null;
      },
    ),
  };
}
