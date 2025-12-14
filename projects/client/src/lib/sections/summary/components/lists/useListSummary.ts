import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { movieListsQuery } from '$lib/requests/queries/movies/movieListsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { combineLatest, map } from 'rxjs';
import { showListsQuery } from '../../../../requests/queries/shows/showListsQuery.ts';
import { MAX_LISTS } from './_internal/constants.ts';

type ListSummaryProps = {
  slug: string;
  type: MediaType;
};

function typeToQuery(
  { slug, type }: ListSummaryProps,
  listType: 'official' | 'personal' = 'personal',
) {
  const params = { slug, type: listType, limit: MAX_LISTS };

  switch (type) {
    case 'movie':
      return movieListsQuery(params);
    case 'show':
      return showListsQuery(params);
  }
}

export function useListSummary({ slug, type }: ListSummaryProps) {
  const personalLists = useQuery(typeToQuery({ slug, type }));
  const officialLists = useQuery(typeToQuery({ slug, type }, 'official'));

  const queries = [personalLists, officialLists];
  const isLoading = combineLatest(queries).pipe(
    map(($queries) => $queries.some(toLoadingState)),
  );

  return {
    isLoading,
    personalLists: personalLists.pipe(
      map(($personalLists) => $personalLists.data ?? []),
    ),
    officialLists: officialLists.pipe(
      map(($officialLists) => $officialLists.data ?? []),
    ),
  };
}
