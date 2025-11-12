import { useQuery } from '$lib/features/query/useQuery.ts';
import { Theme } from '$lib/features/theme/models/Theme.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map, of, shareReplay, switchMap } from 'rxjs';
import { toStore } from '../../../utils/store/toStore.ts';
import {
  currentUserCommentReactionsQuery,
  type UserReactions,
} from '../queries/currentUserCommentReactionsQuery.ts';
import { currentUserFavoritesQuery } from '../queries/currentUserFavoritesQuery.ts';
import {
  currentUserHistoryQuery,
  type UserHistory,
} from '../queries/currentUserHistoryQuery.ts';
import {
  currentUserNetworkQuery,
  type UserNetwork,
} from '../queries/currentUserNetworkQuery.ts';
import {
  currentUserPlexLibraryQuery,
  type UserPlexLibrary,
} from '../queries/currentUserPlexLibraryQuery.ts';
import {
  currentUserRatingsQuery,
  type UserRatings,
} from '../queries/currentUserRatingsQuery.ts';
import {
  currentUserSettingsQuery,
  type UserSettings,
} from '../queries/currentUserSettingsQuery.ts';
import {
  currentUserWatchlistQuery,
  type UserWatchlist,
} from '../queries/currentUserWatchlistQuery.ts';
import { useAuth } from './useAuth.ts';

const ANONYMOUS_USER: UserSettings = {
  id: 0,
  key: 'user-0',
  slug: '',
  username: '',
  token: null,
  name: {
    first: '',
    last: '',
    full: '',
  },
  about: undefined,
  location: undefined,
  avatar: {
    url: '',
  },
  cover: {
    url: '',
  },
  isVip: false,
  isDirector: false,
  isPrivate: false,
  preferences: {
    progress: {
      sort: {
        by: 'added',
        direction: 'asc',
      },
    },
    watch: {
      action: 'now',
    },
    isSpoilerHidden: false,
  },
  genres: [],
  services: {
    country: undefined,
    favorites: [],
    showOnlyFavorites: false,
  },
  permissions: [],
  limits: {
    lists: {
      limit: 0,
      itemLimit: 0,
    },
  },
  preferredTheme: Theme.Dark,
};

const ANONYMOUS_HISTORY: UserHistory = {
  movies: new Map(),
  shows: new Map(),
};

const ANONYMOUS_WATCHLIST: UserWatchlist = {
  movies: new Map(),
  shows: new Map(),
};

const ANONYMOUS_RATINGS: UserRatings = {
  episodes: new Map(),
  movies: new Map(),
  shows: new Map(),
};

const ANONYMOUS_REACTIONS: UserReactions = new Map();

const ANONYMOUS_FAVORITES = {
  movies: new Map(),
  shows: new Map(),
};

const ANONYMOUS_NETWORK: UserNetwork = {
  following: [],
};

const ANONYMOUS_PLEX_LIBRARY: UserPlexLibrary = {
  movieIds: [],
  episodeIds: [],
  showIds: [],
};

function definedData<T>(data: T | undefined): T {
  return data as T;
}

function createAuthorizedObservable<T, TQueryData = T>(
  isAuthorized$: ReturnType<typeof toObservable<boolean>>,
  queryResponse: ReturnType<typeof useQuery>,
  anonymousData: T,
  mapFn?: (queryResult: { data?: TQueryData }) => T,
) {
  return isAuthorized$.pipe(
    switchMap((authorized) =>
      authorized
        ? toObservable(queryResponse).pipe(
          map((queryResult) =>
            mapFn
              ? mapFn(queryResult as { data?: TQueryData })
              : (queryResult.data ?? anonymousData) as T
          ),
        )
        : of(anonymousData)
    ),
    shareReplay(1),
  );
}

export function useUser() {
  const { isAuthorized } = useAuth();

  const userQueryResponse = useQuery(currentUserSettingsQuery());
  const historyQueryResponse = useQuery(currentUserHistoryQuery());
  const watchlistQueryResponse = useQuery(currentUserWatchlistQuery());
  const ratingsQueryResponse = useQuery(currentUserRatingsQuery());
  const commentReactionsQueryResponse = useQuery(
    currentUserCommentReactionsQuery(),
  );
  const favoritesQueryResponse = useQuery(currentUserFavoritesQuery());
  const followingQueryResponse = useQuery(currentUserNetworkQuery());
  const plexLibraryQueryResponse = useQuery(
    currentUserPlexLibraryQuery(),
  );

  const isAuthorized$ = toObservable(isAuthorized).pipe(shareReplay(1));

  const user$ = createAuthorizedObservable(
    isAuthorized$,
    userQueryResponse,
    ANONYMOUS_USER,
    ($query) => definedData($query.data),
  );

  const history$ = createAuthorizedObservable(
    isAuthorized$,
    historyQueryResponse,
    ANONYMOUS_HISTORY,
  );

  const watchlist$ = createAuthorizedObservable(
    isAuthorized$,
    watchlistQueryResponse,
    ANONYMOUS_WATCHLIST,
  );

  const ratings$ = createAuthorizedObservable(
    isAuthorized$,
    ratingsQueryResponse,
    ANONYMOUS_RATINGS,
  );

  const reactions$ = createAuthorizedObservable(
    isAuthorized$,
    commentReactionsQueryResponse,
    ANONYMOUS_REACTIONS,
  );

  const favorites$ = createAuthorizedObservable(
    isAuthorized$,
    favoritesQueryResponse,
    ANONYMOUS_FAVORITES,
  );

  const network$ = createAuthorizedObservable(
    isAuthorized$,
    followingQueryResponse,
    ANONYMOUS_NETWORK,
  );

  const plexLibrary$ = createAuthorizedObservable(
    isAuthorized$,
    plexLibraryQueryResponse,
    ANONYMOUS_PLEX_LIBRARY,
  );

  return {
    user: toStore(user$),
    history: toStore(history$),
    watchlist: toStore(watchlist$),
    ratings: toStore(ratings$),
    reactions: toStore(reactions$),
    favorites: toStore(favorites$),
    network: toStore(network$),
    plexLibrary: toStore(plexLibrary$),
  };
}
