import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { movieListsQuery } from '$lib/requests/queries/movies/movieListsQuery.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { useStableArray } from '$lib/sections/lists/stores/useStableArray.ts';
import { combineLatest, map } from 'rxjs';
import { showListsQuery } from '../../../../requests/queries/shows/showListsQuery.ts';
import { MAX_LISTS } from './_internal/constants.ts';

type ListSummaryProps = {
  slug: string;
  type: MediaType;
  limit?: number;
};

function typeToQuery(
  { slug, type }: ListSummaryProps,
  listType: 'official' | 'personal' = 'personal',
  limit: number = MAX_LISTS,
) {
  const params = { slug, type: listType, limit };

  switch (type) {
    case 'movie':
      return movieListsQuery(params);
    case 'show':
      return showListsQuery(params);
  }
}

const isSameList = (left: MediaListSummary, right: MediaListSummary) =>
  left.key === right.key;

export function useListSummary(
  { slug, type, limit = MAX_LISTS }: ListSummaryProps,
) {
  const personalLists = usePaginatedListQuery(
    typeToQuery({ slug, type }, 'personal', limit),
  );
  const officialLists = usePaginatedListQuery(
    typeToQuery({ slug, type }, 'official', limit),
  );

  const isLoading = combineLatest([
    personalLists.isLoading,
    officialLists.isLoading,
  ]).pipe(
    map(($states) => $states.some(Boolean)),
  );

  const { list: stablePersonalList } = useStableArray(
    isSameList,
    personalLists.list,
  );
  const { list: stableOfficialList } = useStableArray(
    isSameList,
    officialLists.list,
  );

  const list = combineLatest([stablePersonalList, stableOfficialList]).pipe(
    map(([$personal, $official]) => [...$official, ...$personal]),
  );

  const hasNextPage = combineLatest([
    personalLists.hasNextPage,
    officialLists.hasNextPage,
  ]).pipe(
    map(($states) => $states.some(Boolean)),
  );

  const fetchNextPage = async () => {
    await Promise.all([
      personalLists.fetchNextPage(),
      officialLists.fetchNextPage(),
    ]);
  };

  return { isLoading, list, hasNextPage, fetchNextPage };
}
