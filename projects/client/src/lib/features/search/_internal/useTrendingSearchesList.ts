import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { PersonSummary } from '$lib/requests/models/PersonSummary.ts';
import {
  peopleThisMonthQuery,
  type PeopleThisMonthResult,
} from '$lib/requests/queries/people/peopleThisMonthQuery.ts';
import type { SearchMode } from '$lib/requests/queries/search/models/SearchMode.ts';
import {
  searchTrendingQuery,
  type TrendingSearchesResult,
} from '$lib/requests/queries/search/searchTrendingQuery.ts';
import { isSameDayOfYear } from '$lib/utils/date/isSameDayOfYear.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

const LIST_LIMIT = 50;

type TrendingSearches = TrendingSearchesResult | PeopleThisMonthResult;

function modeToQuery(
  mode: SearchMode,
) {
  switch (mode) {
    case 'people':
      return peopleThisMonthQuery() as CreateQueryOptions<
        TrendingSearches
      >;
    default:
      return searchTrendingQuery({ limit: LIST_LIMIT }) as CreateQueryOptions<
        TrendingSearches
      >;
  }
}

function hasBirthday(person: PersonSummary): boolean {
  const today = new Date();
  return person.birthday ? isSameDayOfYear(person.birthday, today) : false;
}

export function useTrendingSearchesList(mode: SearchMode) {
  const query = useQuery(modeToQuery(mode));

  return {
    list: derived(query, ($query) => {
      if (!$query.data) {
        return [];
      }

      if ($query.data.type === 'people') {
        const peopleData = $query.data as {
          type: 'people';
          items: PersonSummary[];
        };
        return peopleData.items
          .sort((a, b) => Number(hasBirthday(b)) - Number(hasBirthday(a)));
      }

      const mediaData = $query.data as { type: 'media'; items: MediaEntry[] };
      return mediaData.items
        .filter((item) => item.type === mode || mode === 'media')
        .slice(0, LIST_LIMIT);
    }),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
}
