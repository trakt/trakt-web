import type { SortBy } from './SortBy.ts';
import type { SortDirection } from './SortDirection.ts';

export type ListSortProps = Readonly<{
  sortBy: SortBy | undefined;
  sortHow: SortDirection;
}>;
