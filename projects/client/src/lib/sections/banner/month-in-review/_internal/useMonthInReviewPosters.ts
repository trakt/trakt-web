import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { map } from 'rxjs';
import { toMonthInReviewPosters } from './toMonthInReviewPosters.ts';

export function useMonthInReviewPosters(month: Date) {
  const { history } = useUser();

  return {
    posters: history.pipe(
      map(($history) =>
        $history ? toMonthInReviewPosters({ history: $history, month }) : null,
      ),
    ),
  };
}
