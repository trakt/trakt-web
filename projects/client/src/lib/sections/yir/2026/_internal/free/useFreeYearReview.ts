import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { toReviewFromWatched } from '$lib/sections/review/toReviewFromWatched.ts';
import { withUserRatings } from '$lib/sections/review/withUserRatings.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import type { FreeYearReview } from './FreeYearReview.ts';
import { toFreeYearStats } from './toFreeYearStats.ts';

type FreeYearReviewParams = {
  year: number;
  isEnabled: boolean;
};

export function useFreeYearReview(params: Observable<FreeYearReviewParams>) {
  const { history, ratings, favorites } = useUser();

  const review = combineLatest([params, history, ratings, favorites]).pipe(
    map(([$params, $history, $ratings, $favorites]): FreeYearReview | null => {
      if (!$params.isEnabled || !$history) return null;

      const watched = toReviewFromWatched({
        history: $history,
        startDate: new Date($params.year, 0, 1),
        endDate: new Date($params.year + 1, 0, 1),
      });
      const byPlays = {
        ...watched,
        titles: watched.titles.toSorted((a, b) => b.plays - a.plays),
      };

      return {
        watched: $ratings
          ? withUserRatings({ review: byPlays, ratings: $ratings })
          : byPlays,
        stats: toFreeYearStats({
          history: $history,
          ratings: $ratings,
          favorites: $favorites,
          year: $params.year,
        }),
      };
    }),
  );

  return { review };
}
