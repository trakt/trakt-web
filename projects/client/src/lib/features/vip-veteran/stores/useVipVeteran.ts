import { useQuery } from '$lib/features/query/useQuery.ts';
import { userProfileQuery } from '$lib/requests/queries/users/userProfileQuery.ts';
import { map, type Observable } from 'rxjs';

export function useVipVeteran(slug$: Observable<string>) {
  const response = useQuery(
    slug$.pipe(map((slug) => userProfileQuery({ slug, enabled: slug !== '' }))),
  );

  return {
    veteran: response.pipe(map(($response) => $response.data?.veteran ?? null)),
  };
}
