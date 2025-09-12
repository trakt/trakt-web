import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { PersonSummary } from '$lib/requests/models/PersonSummary.ts';
import { peopleThisMonthQuery } from '$lib/requests/queries/people/peopleThisMonthQuery.ts';
import type { SearchMode } from '$lib/requests/queries/search/models/SearchMode.ts';
import { searchTrendingQuery } from '$lib/requests/queries/search/searchTrendingQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';

const LIST_LIMIT = 50;

function modeToQuery(
  mode: SearchMode,
) {
  switch (mode) {
    case 'people':
      return peopleThisMonthQuery();
    default:
      return searchTrendingQuery({ limit: LIST_LIMIT });
  }
}

export function useTrendingSearchesList(mode: SearchMode) {
  const query = useQuery(modeToQuery(mode));

  return {
    list: derived(query, ($query) => {
      if (!$query.data) {
        return [];
      }

      if ($query.data.type === 'people') {
        return $query.data.items as PersonSummary[];
      }

      return ($query.data.items as MediaEntry[])
        .filter((item) => item.type === mode || mode === 'media')
        .slice(0, LIST_LIMIT);
    }),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
}
