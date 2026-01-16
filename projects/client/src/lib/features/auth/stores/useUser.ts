import { useQuery } from '$lib/features/query/useQuery.ts';
import { Theme } from '$lib/features/theme/models/Theme.ts';
import { map, of, shareReplay, switchMap } from 'rxjs';
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
  currentUserLikesQuery,
  type UserLikes,
} from '../queries/currentUserLikesQuery.ts';
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

  const userQuerySignal = useQuery(currentUserSettingsQuery());
  const historyQuerySignal = useQuery(currentUserHistoryQuery());
  const watchlistQuerySignal = useQuery(currentUserWatchlistQuery());
  const ratingsQuerySignal = useQuery(currentUserRatingsQuery());
  const commentReactionsQuerySignal = useQuery(
    currentUserCommentReactionsQuery(),
  );
  const favoritesQuerySignal = useQuery(currentUserFavoritesQuery());
  const followingQuerySignal = useQuery(currentUserNetworkQuery());
  const plexLibraryQuerySignal = useQuery(
    currentUserPlexLibraryQuery(),
  );
  const likesQuerySignal = useQuery(currentUserLikesQuery());

  // Create a stream that switches between authorized and anonymous state
  const userContext$ = isAuthorized.pipe(
    switchMap((authorized) => {
      if (!authorized) {
        return of({
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
          likes: of<UserLikes>({
            lists: new Map(),
          }),
        });
      }

      return of({
        user: userQuerySignal.pipe(
          map((query) => definedData(query.data)),
        ),
        history: historyQuerySignal.pipe(
          map((query) => query.data),
        ),
        watchlist: watchlistQuerySignal.pipe(
          map((watchlist) => watchlist.data),
        ),
        ratings: ratingsQuerySignal.pipe(
          map((ratings) => ratings.data),
        ),
        reactions: commentReactionsQuerySignal.pipe(
          map((reactions) => reactions.data),
        ),
        favorites: favoritesQuerySignal.pipe(
          map((favorites) => favorites.data),
        ),
        network: followingQuerySignal.pipe(
          map((network) => network.data),
        ),
        plexLibrary: plexLibraryQuerySignal.pipe(
          map((collection) => collection.data),
        ),
        likes: likesQuerySignal.pipe(
          map((likes) => likes.data),
        ),
      });
    }),
    shareReplay(1),
  );

  return {
    user: userContext$.pipe(switchMap((ctx) => ctx.user)),
    history: userContext$.pipe(switchMap((ctx) => ctx.history)),
    watchlist: userContext$.pipe(switchMap((ctx) => ctx.watchlist)),
    ratings: userContext$.pipe(switchMap((ctx) => ctx.ratings)),
    reactions: userContext$.pipe(switchMap((ctx) => ctx.reactions)),
    favorites: userContext$.pipe(switchMap((ctx) => ctx.favorites)),
    network: userContext$.pipe(switchMap((ctx) => ctx.network)),
    plexLibrary: userContext$.pipe(switchMap((ctx) => ctx.plexLibrary)),
    likes: userContext$.pipe(switchMap((ctx) => ctx.likes)),
  };
}
