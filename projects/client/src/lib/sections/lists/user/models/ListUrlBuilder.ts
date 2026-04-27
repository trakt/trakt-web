import type { SortBy } from './SortBy.ts';
import type { SortDirection } from './SortDirection.ts';

export type ListUrlBuilderParams<T = SortBy> = {
  sortBy?: T;
  sortHow?: SortDirection;
};

export type ListUrlBuilder<T = SortBy> = (
  params: ListUrlBuilderParams<T>,
) => string;
