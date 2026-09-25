import type { SortBy } from './SortBy.ts';
import type { SortDirection } from './SortDirection.ts';

export type ListUrlBuilderParams<T = SortBy> = {
  sortBy?: T;
  sortHow?: SortDirection;
  terms?: string;
};

export type ListUrlBuilder<T = SortBy> = (
  params: ListUrlBuilderParams<T>,
) => string;
