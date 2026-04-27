import type { SortDirection } from '$lib/sections/lists/user/models/SortDirection.ts';
import type { UpNextSortBy } from './UpNextSortBy.ts';

export type UpNextSortProps = {
  sortBy?: UpNextSortBy;
  sortHow?: SortDirection;
};
