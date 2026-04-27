import { useUser } from '$lib/features/auth/stores/useUser.ts';
import {
  RECENTLY_WATCHED_WINDOW,
} from '$lib/features/toast/constants/index.ts';
import { useDismissals } from '$lib/features/toast/useDismissals.ts';
import {
  type EpisodeActivityHistory,
  episodeActivityHistoryQuery,
} from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import {
  type MovieActivityHistory,
  movieActivityHistoryQuery,
} from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { combineLatest, map } from 'rxjs';
import { usePaginatedListQuery } from '../../lists/stores/usePaginatedListQuery.ts';
import { isShowRatingCandidate } from './isShowRatingCandidate.ts';

function toLastWatchedMedia(
  activity: MovieActivityHistory | EpisodeActivityHistory,
) {
  return 'episode' in activity
    ? {
      type: 'show' as const,
      media: activity.show,
    }
    : {
      type: 'movie' as const,
      media: activity.movie,
    };
}

export function useCurrentUserLastWatched() {
  const { ratings, history } = useUser();
  const { isSuppressed, wasDismissed } = useDismissals();

  const params = {
    slug: 'me',
    startDate: new Date(Date.now() - RECENTLY_WATCHED_WINDOW),
    limit: DEFAULT_PAGE_SIZE,
  };

  const { list: movieList } = usePaginatedListQuery(
    movieActivityHistoryQuery(params),
  );
  const { list: episodeList } = usePaginatedListQuery(
    episodeActivityHistoryQuery(params),
  );

  /* list comes from usePaginatedListQuery which now returns an Observable. */
  const list$ = combineLatest([movieList, episodeList]).pipe(
    map(([movies, episodes]) =>
      [...movies, ...episodes].sort(
        (a, b) => b.watchedAt.getTime() - a.watchedAt.getTime(),
      )
    ),
  );

  return {
    lastWatchedItem: combineLatest(
      [list$, ratings, isSuppressed, history],
    ).pipe(
      map(
        ([$list, $ratings, $isSuppressed, $history]) => {
          if (!$ratings || $isSuppressed) {
            return null;
          }

          const unratedItem = $list
            .filter((activity) => !wasDismissed(activity))
            .find((activity) => {
              switch (activity.type) {
                case 'movie':
                  return !$ratings.movies.has(activity.movie.id);
                case 'episode': {
                  const showHistory = $history?.shows.get(activity.show.id);
                  const showWatchDates = showHistory?.watchedDates ?? [];
                  const isRatingCandidate = isShowRatingCandidate({
                    episode: activity.episode,
                    watchDates: showWatchDates,
                    now: new Date(),
                  });

                  return isRatingCandidate &&
                    !$ratings.shows.has(activity.show.id);
                }
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
