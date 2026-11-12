import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { resolveSlurm } from '$lib/features/webview/resolveSlurm.ts';
import { mirDetailQuery } from '$lib/requests/queries/users/mirDetailQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import type { MonthReviewParams } from './MonthReviewParams.ts';
import type { MonthReviewSource } from './MonthReviewSource.ts';
import { toAdjacentMonth } from './toAdjacentMonth.ts';
import { toMonthReviewFromDetail } from './toMonthReviewFromDetail.ts';
import { withRatingsOverlay } from './withRatingsOverlay.ts';

export function useVipMonthReview(
  params: Observable<MonthReviewParams>,
): MonthReviewSource {
  const { ratings } = useUser();
  const slurm = resolveSlurm();
  const current = useQuery(
    params.pipe(
      map(({ slug, year, month, isEnabled }) => ({
        ...mirDetailQuery({ slug, year, month, slurm }),
        enabled: isEnabled,
      })),
    ),
  );
  const previous = useQuery(
    params.pipe(
      map(({ slug, year, month, isEnabled }) => ({
        ...mirDetailQuery({
          slug,
          ...toAdjacentMonth({ year, month, offset: -1 }),
          slurm,
        }),
        enabled: isEnabled,
      })),
    ),
  );

  const review = combineLatest([params, current, previous]).pipe(
    map(([$params, $current, $previous]) =>
      $params.isEnabled && $current.data
        ? toMonthReviewFromDetail({
            detail: $current.data,
            previous: $previous.data,
          })
        : null,
    ),
  );

  return {
    review: withRatingsOverlay({ review, ratings, params }),
    isLoading: combineLatest([current, previous]).pipe(
      map(([$current, $previous]) =>
        [$current, $previous].some(toLoadingState),
      ),
    ),
  };
}
