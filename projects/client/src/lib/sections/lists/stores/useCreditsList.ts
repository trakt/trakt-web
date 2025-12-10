import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { personMovieCreditsQuery } from '$lib/requests/queries/people/personMovieCreditsQuery.ts';
import { personShowCreditsQuery } from '$lib/requests/queries/people/personShowCreditsQuery.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map } from 'rxjs';

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
  const query$ = toObservable(query);

  return {
    credits: query$.pipe(map((q) => q.data)),
    positions: query$.pipe(map((q) => {
      if (!q.data) return [];
      return Array.from(q.data.keys());
    })),
  };
}
