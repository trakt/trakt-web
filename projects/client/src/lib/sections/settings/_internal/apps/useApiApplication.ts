import { combineLatest, map, type Observable } from 'rxjs';
import { useApiApplications } from './useApiApplications.ts';

export function useApiApplication(appId$: Observable<number>) {
  const { apps, isLoading } = useApiApplications();

  const app = combineLatest([apps, appId$]).pipe(
    map(([entries, appId]) => entries.find((entry) => entry.id === appId)),
  );

  return { app, isLoading };
}
