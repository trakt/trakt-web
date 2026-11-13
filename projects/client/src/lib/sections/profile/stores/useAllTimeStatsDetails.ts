import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import { toAllTimeCounts } from './_internal/toAllTimeCounts.ts';
import { useFreeAllTimeStats } from './_internal/useFreeAllTimeStats.ts';
import { useVipAllTimeStats } from './_internal/useVipAllTimeStats.ts';

export function useAllTimeStatsDetails() {
  const { user } = useUser();
  const isVip = user.pipe(
    map(($user) => Boolean($user?.isVip)),
    distinctUntilChanged(),
  );

  const vip = useVipAllTimeStats(isVip);
  const free = useFreeAllTimeStats(isVip.pipe(map((vipUser) => !vipUser)));

  const state = combineLatest([
    vip.details,
    free.details,
    vip.isLoading,
    free.isLoading,
  ]).pipe(
    map(([vipDetails, freeDetails, isVipLoading, isFreeLoading]) => ({
      details: vipDetails ?? freeDetails ?? toAllTimeCounts(null),
      isLoading: isVipLoading || isFreeLoading,
    })),
    multicast(),
  );

  return {
    details: state.pipe(map((s) => s.details)),
    isLoading: state.pipe(map((s) => s.isLoading)),
  };
}
