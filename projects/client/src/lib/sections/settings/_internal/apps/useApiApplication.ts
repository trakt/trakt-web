import { useQuery } from '$lib/features/query/useQuery.ts';
import { apiApplicationsQuery } from '$lib/requests/queries/apps/apiApplicationsQuery.ts';
import { combineLatest, map, type Observable } from 'rxjs';

export function useApiApplication(appId$: Observable<number>) {
  const apiApplications = useQuery(apiApplicationsQuery()).pipe(
    map((query) => query.data ?? []),
  );

  const app = combineLatest([apiApplications, appId$]).pipe(
    map(([apps, appId]) => apps.find((entry) => entry.id === appId)),
  );

  return { app };
}
