import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { connectedAppsQuery } from '$lib/requests/queries/apps/connectedAppsQuery.ts';
import { combineLatest, map } from 'rxjs';

export function useConnectedApps() {
  const query = useQuery(connectedAppsQuery());
  const { user, limits } = useUser();

  const apps = query.pipe(map((state) => state.data ?? []));
  const isLoading = query.pipe(map((state) => state.isLoading));

  const isAtLimit = combineLatest([user, limits]).pipe(
    map(([user, limits]) => {
      if (!limits) return false;

      const limit = user.isVip
        ? limits.connectedApps.vip
        : limits.connectedApps.free;

      return limits.connectedApps.current >= limit;
    }),
  );

  return { apps, isAtLimit, isLoading };
}
