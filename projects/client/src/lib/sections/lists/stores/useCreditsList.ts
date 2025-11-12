import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { personMovieCreditsQuery } from '$lib/requests/queries/people/personMovieCreditsQuery.ts';
import { personShowCreditsQuery } from '$lib/requests/queries/people/personShowCreditsQuery.ts';
import { derived } from 'svelte/store';

type UseCreditsListProps = {
  type: MediaType;
  slug: string;
};

function typeToQuery(
  { type, slug }: UseCreditsListProps,
) {
  const params = { slug };

  switch (type) {
    case 'movie':
      return personMovieCreditsQuery(params);
    case 'show':
      return personShowCreditsQuery(params);
  }
}

export function useCreditsList(
  { type, slug }: UseCreditsListProps,
) {
  const query = useQuery(typeToQuery({ type, slug }));

  return {
    credits: derived(query, ($query) => $query.data),
    positions: derived(query, ($query) => {
      if (!$query.data) return [];
      return Array.from($query.data.keys());
    }),
  };
}
