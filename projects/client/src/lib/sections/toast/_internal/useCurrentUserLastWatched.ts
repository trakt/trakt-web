import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { RECENTLY_WATCHED_WINDOW } from '$lib/features/toast/constants/index.ts';
import { useDismissals } from '$lib/features/toast/useDismissals.ts';
import {
  type MovieActivityHistory,
  movieActivityHistoryQuery,
} from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { combineLatest, map } from 'rxjs';
import { usePaginatedListQuery } from '../../lists/stores/usePaginatedListQuery.ts';

function toLastWatchedMedia(
  activity: MovieActivityHistory,
) {
  return {
    type: 'movie' as const,
    media: activity.movie,
  };
}

export function useCurrentUserLastWatched() {
  const { ratings } = useUser();
  const { isSuppressed, wasDismissed } = useDismissals();

  const { list } = usePaginatedListQuery(movieActivityHistoryQuery({
    slug: 'me',
    startDate: new Date(Date.now() - RECENTLY_WATCHED_WINDOW),
    limit: DEFAULT_PAGE_SIZE,
  }));

  /* list comes from usePaginatedListQuery which now returns an Observable. */
  const list$ = list;

  return {
    lastWatchedItem: combineLatest(
      [list$, ratings, isSuppressed],
    ).pipe(
      map(
        ([$list, $ratings, $isSuppressed]) => {
          if (!$ratings || $isSuppressed) {
            return null;
          }

          const unratedItem = $list
            .filter((activity) => !wasDismissed(activity))
            .find((activity) => {
              if ((activity as { type?: unknown }).type !== 'movie') {
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
    ),
  };
}
