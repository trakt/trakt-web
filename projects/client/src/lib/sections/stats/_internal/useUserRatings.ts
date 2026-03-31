import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import { map, type Observable } from 'rxjs';

const lookbackDays = 14;

export type RatingEntry = {
  readonly ratedAt: Date;
  readonly score: number;
  readonly type: 'movie' | 'show' | 'episode';
};

export function flattenAndFilterRatings(
  data: UserRatings | undefined,
  now: Date,
): readonly RatingEntry[] {
  if (!data) return [];

  const cutoff = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - lookbackDays,
  );
  const entries: RatingEntry[] = [];

  for (const entry of data.movies.values()) {
    entries.push({
      ratedAt: entry.ratedAt,
      score: entry.rating,
      type: 'movie',
    });
  }
  for (const entry of data.shows.values()) {
    entries.push({ ratedAt: entry.ratedAt, score: entry.rating, type: 'show' });
  }
  for (const entry of data.episodes.values()) {
    entries.push({
      ratedAt: entry.ratedAt,
      score: entry.rating,
      type: 'episode',
    });
  }

  return entries.filter((e) => e.ratedAt >= cutoff);
}

export function useUserRatings(): {
  ratings: Observable<ReadonlyArray<RatingEntry>>;
  isLoadingRatings: Observable<boolean>;
} {
  const { ratings: ratingsData } = useUser();
  const now = new Date();

  return {
    ratings: ratingsData.pipe(
      map((data) => flattenAndFilterRatings(data, now)),
    ),
    isLoadingRatings: ratingsData.pipe(
      map((data) => data === undefined),
    ),
  };
}
