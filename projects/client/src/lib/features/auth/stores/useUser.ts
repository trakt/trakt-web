import { useQuery } from '$lib/features/query/useQuery.ts';
import { Theme } from '$lib/features/theme/models/Theme.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map, of } from 'rxjs';
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

function definedData<T>(data: T | undefined): T {
  return data as T;
}

export function useUser() {
  const { isAuthorized } = useAuth();

  if (!isAuthorized.value) {
    return {
      user: of(ANONYMOUS_USER),
      history: of<UserHistory>({
        movies: new Map(),
        shows: new Map(),
      }),
      watchlist: of<UserWatchlist>({
        movies: new Map(),
        shows: new Map(),
      }),
      ratings: of<UserRatings>({
        episodes: new Map(),
        movies: new Map(),
        shows: new Map(),
      }),
      reactions: of<UserReactions>(new Map()),
      favorites: of({
        movies: new Map(),
        shows: new Map(),
      }),
      network: of<UserNetwork>({
        following: [],
      }),
      plexLibrary: of<UserPlexLibrary>({
        movieIds: [],
        episodeIds: [],
        showIds: [],
      }),
    };
  }

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

  const user = toObservable(userQueryResponse).pipe(
    map((q) => definedData(q.data)),
  );
  const history = toObservable(historyQueryResponse).pipe(
    map((q) => q.data),
  );
  const watchlist = toObservable(watchlistQueryResponse).pipe(
    map((q) => q.data),
  );
  const ratings = toObservable(ratingsQueryResponse).pipe(
    map((q) => q.data),
  );
  const reactions = toObservable(commentReactionsQueryResponse).pipe(
    map((q) => q.data),
  );
  const favorites = toObservable(favoritesQueryResponse).pipe(
    map((q) => q.data),
  );
  const network = toObservable(followingQueryResponse).pipe(
    map((q) => q.data),
  );
  const plexLibrary = toObservable(plexLibraryQueryResponse).pipe(
    map((q) => q.data),
  );

  return {
    user,
    history,
    watchlist,
    ratings,
    reactions,
    favorites,
    network,
    plexLibrary,
  };
}
