import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { DismissedItem } from '$lib/features/toast/models/DismissedItem.ts';
import { useDismissals } from '$lib/features/toast/useDismissals.ts';
import {
  type MovieActivityHistory,
  movieActivityHistoryQuery,
} from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { onMount } from 'svelte';
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
  const latestDismissal = new BehaviorSubject<DismissedItem | null>(null);

  const { ratings } = useUser();
  const { latest, wasDismissed } = useDismissals();

  const { list } = usePaginatedListQuery(movieActivityHistoryQuery({
    slug: 'me',
    startDate: new Date(Date.now() - RECENTLY_WATCHED_WINDOW),
    limit: DEFAULT_PAGE_SIZE,
  }));

  onMount(() => {
    const unsubscribe = latest.subscribe((l) => {
      latestDismissal.next(l);
    });

    return () => {
      unsubscribe.unsubscribe();
    };
  });

  return {
    lastWatchedItem: combineLatest([list, ratings, latestDismissal]).pipe(
      map(([l, r, d]) => {
        const hasRecentlyDismissed = d &&
          d.dismissedAt > Date.now() - RECENTLY_WATCHED_WINDOW;

        if (!r || hasRecentlyDismissed) {
          return null;
        }

        const unratedItem = l.find((activity) => {
          if (wasDismissed(activity, d)) {
            return false;
          }

          switch (activity.type) {
            case 'movie':
              return !r.movies.has(activity.movie.id);
            default:
              return false;
          }
        });

        return unratedItem ? toLastWatchedMedia(unratedItem) : null;
      }),
    ),
  };
}
