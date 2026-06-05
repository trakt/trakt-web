import type { Snippet } from 'svelte';
import {
  groupByAdded,
  groupByFirstLetter,
  groupByReleased,
} from './_internal/formatSortValue.ts';
import type { SortBy } from './models/SortBy.ts';

function getGroupBy(sortBy?: SortBy) {
  switch (sortBy) {
    case 'title':
      return groupByFirstLetter;
    case 'added':
      return groupByAdded;
    case 'released':
      return groupByReleased;
    default:
      return undefined;
  }
}

export function useSort(sortBy?: SortBy) {
  const groupBy = getGroupBy(sortBy);
  const hasSortTag = !groupBy && sortBy != null;

  return {
    groupBy,
    toTag: (snippet: Snippet | undefined) => hasSortTag ? snippet : undefined,
  };
}
