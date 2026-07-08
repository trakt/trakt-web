import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { personalListsCountQuery } from '$lib/requests/queries/users/personalListsCountQuery.ts';
import { progressCountQuery } from '$lib/requests/queries/users/progressCountQuery.ts';
import { userStatsQuery } from '$lib/requests/queries/users/userStatsQuery.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import { combineLatest, map } from 'rxjs';
import type { AllTimeStatsDetails } from '../models/AllTimeStatsDetails.ts';

export function useAllTimeStatsDetails() {
  const { dropped, user } = useUser();

  const stats = useQuery(userStatsQuery({ slug: 'me' }));
  const lists = useQuery(personalListsCountQuery({ slug: 'me' }));
  const started = useQuery(progressCountQuery({ intent: 'continue' }));
  const finished = useQuery(progressCountQuery({ intent: 'completed' }));

  const state = combineLatest([
    stats,
    lists,
    started,
    finished,
    dropped,
    user,
  ]).pipe(
    map(([$stats, $lists, $started, $finished, $dropped, $user]) => {
      const details: AllTimeStatsDetails = {
        playCount: $stats.data?.playCount ?? 0,
        minuteCount: $stats.data?.minuteCount ?? 0,
        movieCount: $stats.data?.movieCount ?? 0,
        showCount: $stats.data?.showCount ?? 0,
        episodeCount: $stats.data?.episodeCount ?? 0,
        commentCount: $stats.data?.commentCount ?? 0,
        ratingCount: $stats.data?.ratingCount ?? 0,
        listCount: $lists.data?.count ?? 0,
        droppedCount: $dropped?.shows.size ?? 0,
        startedCount: $user?.isVip ? ($started.data?.count ?? 0) : null,
        finishedCount: $user?.isVip ? ($finished.data?.count ?? 0) : null,
      };

      return {
        details,
        // The core stats query gates the loading state; the auxiliary counts
        // fill in progressively without blocking the whole card.
        isLoading: $stats.isLoading,
      };
    }),
    multicast(),
  );

  return {
    details: state.pipe(map((s) => s.details)),
    isLoading: state.pipe(map((s) => s.isLoading)),
  };
}
