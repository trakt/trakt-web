import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { ListParams } from '../models/ListParams.ts';
import type { SortBy } from '../models/SortBy.ts';
import type { SortDirection } from '../models/SortDirection.ts';

export type ListToQueryProps = PaginationParams & FilterParams & {
  list: ListParams;
  type?: DiscoverMode;
  sortBy?: SortBy | Nil;
  sortHow?: SortDirection | Nil;
};
