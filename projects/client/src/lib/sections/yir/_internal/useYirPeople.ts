import { useQuery } from '$lib/features/query/useQuery.ts';
import { yirPeopleQuery } from '$lib/requests/queries/users/yirPeopleQuery.ts';
import type { YirPeopleType } from '$lib/requests/models/YirPerson.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';

type UseYirPeopleProps = {
  slug: string;
  year: number;
  type: YirPeopleType;
};

export function useYirPeople(props: UseYirPeopleProps) {
  const query = useQuery(yirPeopleQuery(props));

  return {
    people: query.pipe(map(($query) => $query.data)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
