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
import { distance } from '@libn/fuzzy';
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

export function useTrendingSearchesList(mode: SearchMode, term = '') {
  const query = useQuery(modeToQuery(mode));

  return {
    list: derived(query, ($query) => {
      if (!$query.data) {
        return [];
      }

      if ($query.data.type === 'people') {
        return ($query.data.items as PersonSummary[])
          .toSorted((a, b) => Number(hasBirthday(b)) - Number(hasBirthday(a)));
      }

      const mediaData = $query.data as { type: 'media'; items: MediaEntry[] };
      return mediaData.items
        .filter((item) => item.type === mode || mode === 'media')
        .filter((item) => {
          if (!term) return true;

          const lowerTitleParts = item.title.toLowerCase().split(' ');
          const lowerTerm = term.toLowerCase();

          if (term.length < 2) {
            return lowerTitleParts.some((lowerTerm) =>
              lowerTerm.startsWith(term)
            );
          }

          return lowerTitleParts.some((lowerTitle) => {
            const titleSnippet = lowerTitle.slice(0, term.length);

            const levenshteinDistance = distance(
              titleSnippet,
              lowerTerm,
            );

            const acceptedDistance = Math.floor(term.length * 0.3);

            return levenshteinDistance <= acceptedDistance;
          });
        });
    }),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
}
