import { useQuery } from '$lib/features/query/useQuery.ts';
import { promotionsQuery } from '$lib/requests/promotions/promotionsQuery.ts';
import { distinctUntilChanged, map, switchMap } from 'rxjs';
import { watchActiveOffer } from './_internal/watchActiveOffer.ts';

export function useActiveOffer() {
  const offer = useQuery(promotionsQuery()).pipe(
    map((query) => query.data ?? []),
    switchMap(watchActiveOffer),
    distinctUntilChanged(),
  );

  return { offer };
}
