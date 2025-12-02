import type { SortBy } from './SortBy.ts';
import type { SortDirection } from './SortDirection.ts';

export type ListUrlBuilderParams = {
  sortBy?: SortBy;
  sortHow?: SortDirection;
};

export type ListUrlBuilder = (params: ListUrlBuilderParams) => string;
