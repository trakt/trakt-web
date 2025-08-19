import { useQuery } from '$lib/features/query/useQuery.ts';
import { derived, get, readable } from 'svelte/store';
import {
  currentUserCommentLikesQuery,
  type UserLike,
} from '../queries/currentUserCommentLikesQuery.ts';
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
  const commentLikesQueryResponse = useQuery(currentUserCommentLikesQuery());
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
  const likes = derived(
    commentLikesQueryResponse,
    ($likes) => $likes.data,
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
    likes,
    reactions,
    favorites,
    network,
    plexCollection,
  };
}
