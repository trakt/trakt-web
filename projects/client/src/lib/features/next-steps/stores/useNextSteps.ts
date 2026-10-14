import { currentUserNetworkQuery } from '$lib/features/auth/queries/currentUserNetworkQuery.ts';
import {
  currentUserRatingsQuery,
  type UserRatings,
} from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import {
  currentUserSettingsQuery,
  type UserSettings,
} from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import { currentUserWatchlistQuery } from '$lib/features/auth/queries/currentUserWatchlistQuery.ts';
import { useInfiniteQuery, useQuery } from '$lib/features/query/useQuery.ts';
import { streamingConnectionsQuery } from '$lib/requests/queries/streaming-sync/streamingConnectionsQuery.ts';
import { activityHistoryQuery } from '$lib/requests/queries/users/activityHistoryQuery.ts';
import { personalListsQuery } from '$lib/requests/queries/users/personalListsQuery.ts';
import { userCommentCountQuery } from '$lib/requests/queries/users/userCommentCountQuery.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import { combineLatest, map, type Observable, of, switchMap } from 'rxjs';
import type { NextStepId } from '../NextStepId.ts';
import type { NextStepsState } from '../NextStepsState.ts';
import { selectNextSteps } from '../selectNextSteps.ts';
import { toNextStepSignals } from '../toNextStepSignals.ts';
import { toSettledData } from '../toSettledData.ts';
import { useNextStepsPreferences } from './useNextStepsPreferences.ts';

const LOADING: NextStepsState = { status: 'loading' };
const HIDDEN: NextStepsState = { status: 'hidden' };
const PROBE = { slug: 'me', limit: 1 };

type BrowsingSettings = Pick<UserSettings, 'genres' | 'services'>;

const NO_SETTINGS: BrowsingSettings = {
  genres: { loved: [] },
  services: { favorites: [] },
};
const NO_WATCHLIST = { movies: new Set<number>(), shows: new Set<number>() };
const NO_RATINGS: UserRatings = {
  movies: new Map(),
  shows: new Map(),
  seasons: new Map(),
  episodes: new Map(),
};
const NO_NETWORK = { following: [] };

type FirstPageQuery = {
  isPending: boolean;
  data?: { pages: ReadonlyArray<{ entries: ReadonlyArray<unknown> }> };
};

function toFirstPageCount(query: FirstPageQuery): number | null {
  if (query.isPending) return null;
  return query.data?.pages.at(0)?.entries.length ?? 0;
}

export function useNextSteps() {
  const { preferences, dismiss, skip, unskip } = useNextStepsPreferences();
  const settings = useQuery(currentUserSettingsQuery());
  const watchlist = useQuery(currentUserWatchlistQuery());
  const ratings = useQuery(currentUserRatingsQuery());
  const network = useQuery(currentUserNetworkQuery());
  const connections = useQuery(streamingConnectionsQuery());
  const comments = useQuery(userCommentCountQuery({ slug: 'me' }));
  const history = useInfiniteQuery(activityHistoryQuery(PROBE));
  const lists = useInfiniteQuery(personalListsQuery(PROBE));

  const signals = combineLatest([
    combineLatest([settings, watchlist, ratings, network]),
    combineLatest([connections, comments, history, lists]),
  ]).pipe(
    map((
      [
        [$settings, $watchlist, $ratings, $network],
        [$connections, $comments, $history, $lists],
      ],
    ) =>
      toNextStepSignals({
        user: toSettledData<BrowsingSettings>($settings, NO_SETTINGS),
        watchlist: toSettledData($watchlist, NO_WATCHLIST),
        ratings: toSettledData($ratings, NO_RATINGS),
        network: toSettledData($network, NO_NETWORK),
        connections: toSettledData($connections, []),
        commentsCount: toSettledData($comments, 0),
        watchedCount: toFirstPageCount($history),
        listsCount: toFirstPageCount($lists),
      })
    ),
  );

  const pageState = (
    skipped: ReadonlyArray<NextStepId>,
  ): Observable<NextStepsState> =>
    signals.pipe(
      map(($signals): NextStepsState => {
        if (!$signals) return LOADING;

        const page = selectNextSteps($signals, skipped);
        return page ? { status: 'visible', page } : HIDDEN;
      }),
    );

  // A dismissed member never subscribes to the sources, so none of the
  // requests above are made.
  const state = preferences.pipe(
    switchMap(($preferences) =>
      $preferences.isDismissed ? of(HIDDEN) : pageState($preferences.skipped)
    ),
    multicast(),
  );

  return { state, dismiss, skip, unskip };
}
