import {
  currentUserRatingsQuery,
  type UserRatings,
} from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { userCommentCountQuery } from '$lib/requests/queries/users/userCommentCountQuery.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import type { AllTimeStatsDetails } from '../../models/AllTimeStatsDetails.ts';
import { computeUserStats } from './computeUserStats.ts';
import { toFreeAllTimeCounts } from './toFreeAllTimeCounts.ts';

const EMPTY_RATINGS: UserRatings = {
  movies: new Map(),
  shows: new Map(),
  seasons: new Map(),
  episodes: new Map(),
};

export function useFreeAllTimeStats(isEnabled: Observable<boolean>) {
  const { history } = useUser();
  const ratings = useQuery(currentUserRatingsQuery());
  const comments = useQuery(
    isEnabled.pipe(
      map((enabled) => ({ ...userCommentCountQuery({ slug: 'me' }), enabled })),
    ),
  );

  const source = combineLatest([isEnabled, history, ratings, comments]);

  return {
    details: source.pipe(
      map(
        ([
          enabled,
          $history,
          $ratings,
          $comments,
        ]): AllTimeStatsDetails | null =>
          enabled && $history && !$ratings.isPending
            ? toFreeAllTimeCounts({
                stats: computeUserStats({
                  history: $history,
                  ratings: $ratings.data ?? EMPTY_RATINGS,
                }),
                commentCount: $comments.data,
              })
            : null,
      ),
    ),
    isLoading: source.pipe(
      map(
        ([enabled, $history, $ratings, $comments]) =>
          enabled && (!$history || $ratings.isPending || $comments.isLoading),
      ),
    ),
  };
}
