import { useQuery } from '$lib/features/query/useQuery.ts';
import { peopleSummaryQuery } from '$lib/requests/queries/people/peopleSummaryQuery.ts';
import { derived } from 'svelte/store';

export function usePerson(slug: string) {
  const person = useQuery(peopleSummaryQuery({
    slug,
  }));

  return {
    isLoading: derived(person, ($person) => $person.isPending),
    person: derived(person, ($person) => $person.data),
  };
}
