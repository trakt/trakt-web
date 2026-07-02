import { useQuery } from '$lib/features/query/useQuery.ts';
import { apiApplicationsQuery } from '$lib/requests/queries/apps/apiApplicationsQuery.ts';
import { map } from 'rxjs';

export function useApiApplications() {
  const query = useQuery(apiApplicationsQuery());

  const apps = query.pipe(map((state) => state.data ?? []));
  const isLoading = query.pipe(map((state) => state.isLoading));

  return { apps, isLoading };
}
