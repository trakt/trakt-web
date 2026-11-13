import { useQuery } from '$lib/features/query/useQuery.ts';
import { userStatsQuery } from '$lib/requests/queries/users/userStatsQuery.ts';
import { map, type Observable } from 'rxjs';
import type { AllTimeStatsDetails } from '../../models/AllTimeStatsDetails.ts';
import { toAllTimeCounts } from './toAllTimeCounts.ts';

export function useVipAllTimeStats(isEnabled: Observable<boolean>) {
  const stats = useQuery(
    isEnabled.pipe(
      map((enabled) => ({ ...userStatsQuery({ slug: 'me' }), enabled })),
    ),
  );

  return {
    details: stats.pipe(
      map(($stats): AllTimeStatsDetails | null =>
        $stats.isEnabled ? toAllTimeCounts($stats.data) : null,
      ),
    ),
    isLoading: stats.pipe(map(($stats) => $stats.isLoading)),
  };
}
