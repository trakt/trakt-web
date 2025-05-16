import {
  currentUserLikesQuery,
  type UserLike,
} from '$lib/features/auth/queries/currentUserLikesQuery.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { derived, get, readable } from 'svelte/store';
import {
  currentUserHistoryQuery,
  type UserHistory,
} from '../queries/currentUserHistoryQuery.ts';
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
import { getToken, setToken } from '../token/index.ts';
import { useAuth } from './useAuth.ts';

const ANONYMOUS_USER: UserSettings = {
  id: 0,
  slug: '',
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
};

function definedData<T>(data: T | undefined): T {
  return data as T;
}

export function useUser() {
  const { isAuthorized } = useAuth();

  if (!get(isAuthorized)) {
    return {
      user: readable(ANONYMOUS_USER),
      history: readable<UserHistory>({
        movies: new Map(),
        shows: new Map(),
      }),
      watchlist: readable<UserWatchlist>({
        movies: new Map(),
        shows: new Map(),
      }),
      ratings: readable<UserRatings>({
        episodes: new Map(),
        movies: new Map(),
        shows: new Map(),
      }),
      likes: readable<UserLike[]>([]),
    };
  }

  const userQueryResponse = useQuery(currentUserSettingsQuery());
  const historyQueryResponse = useQuery(currentUserHistoryQuery());
  const watchlistQueryResponse = useQuery(currentUserWatchlistQuery());
  const ratingsQueryResponse = useQuery(currentUserRatingsQuery());
  const likesQueryResponse = useQuery(currentUserLikesQuery());

  const user = derived(
    userQueryResponse,
    ($query) => {
      /**
       * FIXME: this is a quick hack to enable hd nitro only for internal testing
       * remove once the system is tested
       */
      setToken({
        ...getToken(),
        isDirector: $query.data?.isDirector,
      });
      return definedData($query.data);
    },
  );
  const history = derived(
    historyQueryResponse,
    ($query) => definedData($query.data),
  );
  const watchlist = derived(
    watchlistQueryResponse,
    ($watchlist) => definedData($watchlist.data),
  );
  const ratings = derived(
    ratingsQueryResponse,
    ($ratings) => definedData($ratings.data),
  );
  const likes = derived(
    likesQueryResponse,
    ($likes) => definedData($likes.data),
  );

  return {
    user,
    history,
    watchlist,
    ratings,
    likes,
  };
}
