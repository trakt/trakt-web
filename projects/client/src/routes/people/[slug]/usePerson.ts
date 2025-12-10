import { useQuery } from '$lib/features/query/useQuery.ts';
import { peopleSummaryQuery } from '$lib/requests/queries/people/peopleSummaryQuery.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map } from 'rxjs';

export function usePerson(slug: string) {
  const person = useQuery(peopleSummaryQuery({
    slug,
  }));
  const person$ = toObservable(person);

  return {
    isLoading: person$.pipe(map((p) => p.isPending)),
    person: person$.pipe(map((p) => p.data)),
  };
}
