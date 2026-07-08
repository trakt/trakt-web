import { useQuery } from '$lib/features/query/useQuery.ts';
import { personalListsCountQuery } from '$lib/requests/queries/users/personalListsCountQuery.ts';
import { userStatsQuery } from '$lib/requests/queries/users/userStatsQuery.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import { combineLatest, map } from 'rxjs';

export type AllTimeStats = {
  playCount: number;
  movieCount: number;
  showCount: number;
  episodeCount: number;
  commentCount: number;
  listCount: number;
};

const emptyStats: AllTimeStats = {
  playCount: 0,
  movieCount: 0,
  showCount: 0,
  episodeCount: 0,
  commentCount: 0,
  listCount: 0,
};

export function useAllTimeStats() {
  const stats = useQuery(userStatsQuery({ slug: 'me' }));
  const lists = useQuery(personalListsCountQuery({ slug: 'me' }));

  const state = combineLatest([stats, lists]).pipe(
    map(([$stats, $lists]) => ({
      stats: $stats.data
        ? {
          playCount: $stats.data.playCount,
          movieCount: $stats.data.movieCount,
          showCount: $stats.data.showCount,
          episodeCount: $stats.data.episodeCount,
          commentCount: $stats.data.commentCount,
          listCount: $lists.data?.count ?? 0,
        }
        : emptyStats,
      isLoading: $stats.isLoading,
    })),
    multicast(),
  );

  return {
    stats: state.pipe(map((s) => s.stats)),
    isLoading: state.pipe(map((s) => s.isLoading)),
  };
}
