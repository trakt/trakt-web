import { useQuery } from '$lib/features/query/useQuery.ts';
import { Theme } from '$lib/features/theme/models/Theme.ts';
import { type UserLimits } from '$lib/requests/models/UserLimits.ts';
import { blockedUsersQuery } from '$lib/requests/queries/users/blockedUsersQuery.ts';
import { userLimitsQuery } from '$lib/requests/queries/vip/userLimitsQuery.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import { map, of, switchMap } from 'rxjs';
import { getContext, setContext } from 'svelte';
import {
  currentUserCollectionQuery,
  type UserCollection,
} from '../queries/currentUserCollectionQuery.ts';
import {
  currentUserCommentReactionsQuery,
  type UserReactions,
} from '../queries/currentUserCommentReactionsQuery.ts';
import {
  currentUserDroppedQuery,
  type UserDroppedHistory,
} from '../queries/currentUserDroppedQuery.ts';
import { currentUserFavoritesQuery } from '../queries/currentUserFavoritesQuery.ts';
import {
  currentUserLikesQuery,
  type UserLikes,
} from '../queries/currentUserLikesQuery.ts';
import {
  currentUserNetworkQuery,
  type UserNetwork,
} from '../queries/currentUserNetworkQuery.ts';
import {
  currentUserNotesQuery,
  type UserNotesHistory,
} from '../queries/currentUserNotesQuery.ts';
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
import {
  useCurrentUserHistory,
  type UserHistory,
} from './useCurrentUserHistory.ts';

const ANONYMOUS_USER: UserSettings = {
  id: 0,
  key: 'user-0',
  email: '',
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
    hasWatchAgain: false,
    showRatingPrompt: true,
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

const USE_USER_CONTEXT_KEY = Symbol('use-user');

type UseUserInstance = ReturnType<typeof createUseUserInstance>;

function createUseUserInstance() {
  const { isAuthorized } = useAuth();

  const userQuerySignal = useQuery(currentUserSettingsQuery());
  const { history: historySignal } = useCurrentUserHistory();
  const watchlistQuerySignal = useQuery(currentUserWatchlistQuery());
  const collectionQuerySignal = useQuery(currentUserCollectionQuery());
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
  const limitsQuerySignal = useQuery(userLimitsQuery());
  const notesQuerySignal = useQuery(currentUserNotesQuery());
  const droppedQuerySignal = useQuery(currentUserDroppedQuery());
  const blockedQuerySignal = useQuery(blockedUsersQuery());

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
            movies: new Set(),
            shows: new Set(),
          }),
          collection: of<UserCollection>({
            movies: new Set(),
            episodes: new Set(),
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
          limits: of<UserLimits | null>(null),
          notes: of<UserNotesHistory>({
            movies: new Map(),
            shows: new Map(),
          }),
          dropped: of<UserDroppedHistory>({
            shows: new Set(),
          }),
          blocked: of<Set<string>>(new Set()),
        });
      }

      return of({
        user: userQuerySignal.pipe(
          map((query) => definedData(query.data)),
        ),
        history: historySignal,
        watchlist: watchlistQuerySignal.pipe(
          map((watchlist) => watchlist.data),
        ),
        collection: collectionQuerySignal.pipe(
          map((collection) => collection.data),
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
        limits: limitsQuerySignal.pipe(
          map((limits) => limits.data),
        ),
        notes: notesQuerySignal.pipe(
          map((notes) => notes.data),
        ),
        dropped: droppedQuerySignal.pipe(
          map((dropped) => dropped.data),
        ),
        blocked: blockedQuerySignal.pipe(
          map((blocked) =>
            new Set(
              (blocked.data ?? [])
                .map((profile) => profile.slug)
                .filter((slug): slug is string => Boolean(slug)),
            )
          ),
        ),
      });
    }),
  );
  // Multicast the auth -> ctx switchMap so each slice doesn't redo the
  // `isAuthorized.pipe(switchMap(...))` work. The underlying QueryObservers
  // are already deduped by `useQuery`'s own multicast.
  const sharedUserContext$ = userContext$.pipe(multicast());

  return {
    user: sharedUserContext$.pipe(switchMap((ctx) => ctx.user)),
    history: sharedUserContext$.pipe(switchMap((ctx) => ctx.history)),
    watchlist: sharedUserContext$.pipe(switchMap((ctx) => ctx.watchlist)),
    collection: sharedUserContext$.pipe(switchMap((ctx) => ctx.collection)),
    ratings: sharedUserContext$.pipe(switchMap((ctx) => ctx.ratings)),
    reactions: sharedUserContext$.pipe(switchMap((ctx) => ctx.reactions)),
    favorites: sharedUserContext$.pipe(switchMap((ctx) => ctx.favorites)),
    network: sharedUserContext$.pipe(switchMap((ctx) => ctx.network)),
    plexLibrary: sharedUserContext$.pipe(switchMap((ctx) => ctx.plexLibrary)),
    likes: sharedUserContext$.pipe(switchMap((ctx) => ctx.likes)),
    limits: sharedUserContext$.pipe(switchMap((ctx) => ctx.limits)),
    notes: sharedUserContext$.pipe(switchMap((ctx) => ctx.notes)),
    dropped: sharedUserContext$.pipe(switchMap((ctx) => ctx.dropped)),
    blocked: sharedUserContext$.pipe(switchMap((ctx) => ctx.blocked)),
  };
}

// Memoize per AuthProvider scope so descendants share one instance of the
// user query chain. `AuthProvider` seeds the context; any call below it
// returns the same set of observables instead of spawning fresh
// `useQuery(...)` setups.
export function useUser(): UseUserInstance {
  const existing = getContext<UseUserInstance | undefined>(
    USE_USER_CONTEXT_KEY,
  );
  if (existing) return existing;

  const instance = createUseUserInstance();
  setContext(USE_USER_CONTEXT_KEY, instance);
  return instance;
}
