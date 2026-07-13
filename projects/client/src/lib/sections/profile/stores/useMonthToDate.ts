import { useIsMe } from '$lib/features/auth/stores/useIsMe.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import { movieActivityHistoryQuery } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import { showActivityHistoryQuery } from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { combineLatest, map } from 'rxjs';
import { usePaginatedListQuery } from '../../lists/stores/usePaginatedListQuery.ts';
import { mapToMonthToDateDetails } from './_internal/mapToMonthToDateDetails.ts';

const HISTORY_LIMIT = 1000;

type UseMonthToDateProps = {
  slug: string;
};

function countRatingsSince(
  ratings: UserRatings | undefined,
  since: Date,
): number {
  if (!ratings) return 0;

  const inRange = (entries: UserRatings['movies']) =>
    [...entries.values()].filter((entry) => entry.ratedAt >= since).length;

  return inRange(ratings.movies) +
    inRange(ratings.shows) +
    inRange(ratings.episodes);
}

export function useMonthToDate({ slug }: UseMonthToDateProps) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const monthStart = new Date(Date.UTC(year, month, 1));

  const params = {
    limit: HISTORY_LIMIT,
    slug,
    startDate: monthStart,
    endDate: new Date(Date.UTC(year, month, now.getUTCDate() + 1)),
  };

  const { list: movies, isLoading: isLoadingMovies } = usePaginatedListQuery(
    movieActivityHistoryQuery(params),
  );
  const { list: shows, isLoading: isLoadingShows } = usePaginatedListQuery(
    showActivityHistoryQuery(params),
  );

  const { isMe } = useIsMe(slug);
  const { ratings } = useUser();

  return {
    monthToDate: combineLatest([movies, shows, ratings, isMe]).pipe(
      map(
        ([$movies, $shows, $ratings, $isMe]) =>
          mapToMonthToDateDetails({
            movies: $movies,
            episodes: $shows,
            // Ratings come from the current user's own data, so only surface
            // the count on the current user's own profile.
            ratingCount: $isMe
              ? countRatingsSince($ratings, monthStart)
              : undefined,
          }),
      ),
    ),
    isLoading: combineLatest([isLoadingMovies, isLoadingShows]).pipe(
      map(
        ([$isLoadingMovies, $isLoadingShows]) =>
          $isLoadingMovies || $isLoadingShows,
      ),
    ),
  };
}
