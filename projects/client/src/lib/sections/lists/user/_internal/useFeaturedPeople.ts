import { useQuery } from '$lib/features/query/useQuery.ts';
import { listFeaturedPeopleQuery } from '$lib/requests/queries/lists/listFeaturedPeopleQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, type Observable } from 'rxjs';

export function useFeaturedPeople(listId$: Observable<number>) {
  const query = useQuery(
    listId$.pipe(map((listId) => listFeaturedPeopleQuery({ listId }))),
  );

  return {
    people: query.pipe(map(($query) => $query.data ?? [])),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
