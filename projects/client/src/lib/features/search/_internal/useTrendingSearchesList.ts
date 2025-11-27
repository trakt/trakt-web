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
          const lowerTerm = term.toLowerCase().trim();
          if (!lowerTerm) return true;

          const titlePartSnippets = item.title
            .toLowerCase()
            .trim()
            .split(' ')
            .map((part) => part.slice(0, lowerTerm.length));

          if (lowerTerm.length === 1) {
            return titlePartSnippets.includes(lowerTerm);
          }

          return titlePartSnippets.some((titlePartSnippet) => {
            const levenshteinDistance = distance(
              titlePartSnippet,
              lowerTerm,
            );

            const acceptedDistance = Math.floor(lowerTerm.length * 0.3);

            return levenshteinDistance <= acceptedDistance;
          });
        })
        .sort((a, b) => {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          const lowerTerm = term.toLowerCase().trim();

          const aIndex = aTitle.indexOf(lowerTerm);
          const bIndex = bTitle.indexOf(lowerTerm);

          if (aIndex !== bIndex) {
            return aIndex - bIndex;
          }

          return aTitle.localeCompare(bTitle);
        });
    }),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
}
