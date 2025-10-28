import { useQuery } from '$lib/features/query/useQuery.ts';
import { Theme } from '$lib/features/theme/models/Theme.ts';
import { derived, get, readable } from 'svelte/store';
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
  currentUserPlexCollectionQuery,
  type UserPlexCollection,
} from '../queries/currentUserPlexCollectionQuery.ts';
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
      reactions: readable<UserReactions>(new Map()),
      favorites: readable({
        movies: new Map(),
        shows: new Map(),
      }),
      network: readable<UserNetwork>({
        following: [],
      }),
      plexCollection: readable<UserPlexCollection>({
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
  const plexCollectionQueryResponse = useQuery(
    currentUserPlexCollectionQuery(),
  );

  const user = derived(
    userQueryResponse,
    ($query) => definedData($query.data),
  );
  const history = derived(
    historyQueryResponse,
    ($query) => $query.data,
  );
  const watchlist = derived(
    watchlistQueryResponse,
    ($watchlist) => $watchlist.data,
  );
  const ratings = derived(
    ratingsQueryResponse,
    ($ratings) => $ratings.data,
  );
  const reactions = derived(
    commentReactionsQueryResponse,
    ($reactions) => $reactions.data,
  );
  const favorites = derived(
    favoritesQueryResponse,
    ($favorites) => $favorites.data,
  );
  const network = derived(
    followingQueryResponse,
    ($network) => $network.data,
  );
  const plexCollection = derived(
    plexCollectionQueryResponse,
    ($collection) => $collection.data,
  );

  return {
    user,
    history,
    watchlist,
    ratings,
    reactions,
    favorites,
    network,
    plexCollection,
  };
}
