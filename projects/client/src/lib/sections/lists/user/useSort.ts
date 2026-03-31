import type { Snippet } from 'svelte';
import { groupByFirstLetter } from './_internal/formatSortValue.ts';
import type { SortBy } from './models/SortBy.ts';

export function useSort(sortBy?: SortBy) {
  const isGrouped = sortBy === 'title';
  const hasSortTag = !isGrouped && sortBy != null;

  return {
    groupBy: isGrouped ? groupByFirstLetter : undefined,
    toTag: (snippet: Snippet | undefined) => hasSortTag ? snippet : undefined,
  };
}
