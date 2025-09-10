import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { DismissedItem } from '$lib/features/toast/models/DismissedItem.ts';
import { useDismissals } from '$lib/features/toast/useDismissals.ts';
import {
  type ActivityHistory,
  activityHistoryQuery,
} from '$lib/requests/queries/users/activityHistoryQuery.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import { onMount } from 'svelte';
import { derived, writable } from 'svelte/store';

const RECENTLY_WATCHED_WINDOW = time.days(1);

function toLastWatchedMedia(
  activity: ActivityHistory,
) {
  switch (activity.type) {
    case 'episode':
      return {
        type: 'episode' as const,
        media: activity.episode,
        show: activity.show,
      };
    case 'movie':
      return {
        type: 'movie' as const,
        media: activity.movie,
      };
  }
}

export function useCurrentUserLastWatched() {
  const latestDismissal = writable<DismissedItem | null>(null);

  const { ratings } = useUser();
  const { latest, wasDismissed } = useDismissals();

  const query = useQuery(activityHistoryQuery({
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
      [query, ratings, latestDismissal],
      ([$query, $ratings, $latestDismissal]) => {
        const hasRecentlyDismissed = $latestDismissal &&
          $latestDismissal.dismissedAt > Date.now() - RECENTLY_WATCHED_WINDOW;

        if (!$query.data || !$ratings || hasRecentlyDismissed) {
          return null;
        }

        const unratedItem = $query.data.entries.find((activity) => {
          if (wasDismissed(activity, $latestDismissal)) {
            return false;
          }

          switch (activity.type) {
            case 'episode':
              return !$ratings.episodes.has(activity.episode.id);
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
