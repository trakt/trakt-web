import { getLocale } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { peopleSummaryQuery } from '$lib/requests/queries/people/peopleSummaryQuery.ts';
import { map, type Observable } from 'rxjs';

export function usePerson(slug$: Observable<string>) {
  const person = useQuery(
    slug$.pipe(
      map((slug) => peopleSummaryQuery({ slug, locale: getLocale() })),
    ),
  );

  return {
    isLoading: person.pipe(map(($person) => $person.isPending)),
    person: person.pipe(map(($person) => $person.data)),
  };
}
