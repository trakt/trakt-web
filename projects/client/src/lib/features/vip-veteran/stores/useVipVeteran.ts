import { useQuery } from '$lib/features/query/useQuery.ts';
import { userProfileQuery } from '$lib/requests/queries/users/userProfileQuery.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import { useVipVeteranEnabled } from './useVipVeteranEnabled.ts';

export function useVipVeteran(slug$: Observable<string>) {
  const isEnabled = useVipVeteranEnabled();

  const response = useQuery(
    combineLatest([slug$, isEnabled]).pipe(
      map(([slug, enabled]) => userProfileQuery({ slug, enabled })),
    ),
  );

  return {
    veteran: combineLatest([response, isEnabled]).pipe(
      map(([$response, enabled]) =>
        enabled ? $response.data?.veteran ?? null : null
      ),
    ),
  };
}
