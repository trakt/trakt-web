import { peopleSummaryQuery } from '$lib/requests/queries/people/peopleSummaryQuery';
import { time } from '$lib/utils/timing/time.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export function usePerson(slug: string) {
  const person = createQuery({
    ...peopleSummaryQuery({
      slug,
    }),
    staleTime: time.days(1),
  });

  return {
    isLoading: derived(person, ($person) => $person.isPending),
    person: derived(person, ($person) => $person.data),
  };
}
