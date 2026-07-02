import { useQuery } from '$lib/features/query/useQuery.ts';
import { connectedAppsQuery } from '$lib/requests/queries/apps/connectedAppsQuery.ts';
import { map } from 'rxjs';

export function useConnectedApps() {
  const query = useQuery(connectedAppsQuery());

  const apps = query.pipe(map((state) => state.data ?? []));
  const isLoading = query.pipe(map((state) => state.isLoading));

  return { apps, isLoading };
}
