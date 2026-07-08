import { useQuery } from '$lib/features/query/useQuery.ts';
import { userStatsQuery } from '$lib/requests/queries/users/userStatsQuery.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import { map } from 'rxjs';
import type { AllTimeStatsDetails } from '../models/AllTimeStatsDetails.ts';
import { toAllTimeCounts } from './_internal/toAllTimeCounts.ts';

export function useAllTimeStatsDetails() {
  const stats = useQuery(userStatsQuery({ slug: 'me' }));

  const state = stats.pipe(
    map(($stats) => {
      const details: AllTimeStatsDetails = {
        ...toAllTimeCounts($stats.data),
      };

      return {
        details,
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
