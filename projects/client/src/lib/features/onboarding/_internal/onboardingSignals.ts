import type { UserNetwork } from '$lib/features/auth/queries/currentUserNetworkQuery.ts';
import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { UserWatchlist } from '$lib/features/auth/queries/currentUserWatchlistQuery.ts';
import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { filter, map, type Observable, scan } from 'rxjs';
import type { OnboardingSignalSource } from '$lib/features/onboarding/models/OnboardingSignalSource.ts';

type UserStreams = ReturnType<typeof useUser>;

function fromUser<T>(
  pick: (user: UserStreams) => Observable<T>,
  count: (value: T) => number,
): OnboardingSignalSource {
  return () =>
    pick(useUser()).pipe(
      filter((value) => value != null),
      map(count),
    );
}

function sum(values: ReadonlyArray<number>): number {
  return values.reduce((total, value) => total + value, 0);
}

function countWatchlist(watchlist: UserWatchlist | Nil): number {
  return (watchlist?.movies.size ?? 0) + (watchlist?.shows.size ?? 0);
}

function countPlays(history: UserHistory | Nil): number {
  if (!history) return 0;

  const moviePlays = Array.from(history.movies.values()).map(
    (movie) => movie.plays,
  );
  const episodePlays = Array.from(history.shows.values()).flatMap((show) =>
    show.episodes.map((episode) => episode.plays),
  );
  return sum([...moviePlays, ...episodePlays]);
}

function countRatings(ratings: UserRatings | Nil): number {
  return (
    (ratings?.movies.size ?? 0) +
    (ratings?.shows.size ?? 0) +
    (ratings?.seasons.size ?? 0) +
    (ratings?.episodes.size ?? 0)
  );
}

function countFollowing(network: UserNetwork | Nil): number {
  return network?.following.length ?? 0;
}

export const onboardingSignals = {
  watchlist: fromUser(({ watchlist }) => watchlist, countWatchlist),
  plays: fromUser(
    ({ history }) =>
      history.pipe(
        scan(
          (previous: UserHistory | null, current) => current ?? previous,
          null,
        ),
      ),
    countPlays,
  ),
  ratings: fromUser(({ ratings }) => ratings, countRatings),
  following: fromUser(({ network }) => network, countFollowing),
} satisfies Record<string, OnboardingSignalSource>;
