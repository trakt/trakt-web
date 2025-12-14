import { useQuery } from '$lib/features/query/useQuery.ts';
import { peopleSummaryQuery } from '$lib/requests/queries/people/peopleSummaryQuery.ts';
import { map } from 'rxjs';

export function usePerson(slug: string) {
  const person = useQuery(peopleSummaryQuery({
    slug,
  }));

  return {
    isLoading: person.pipe(map(($person) => $person.isPending)),
    person: person.pipe(map(($person) => $person.data)),
  };
}
