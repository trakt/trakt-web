import type { SortBy } from './SortBy.ts';
import type { SortDirection } from './SortDirection.ts';

export type Sorting<T = SortBy> = {
  text: () => string;
  label: () => string;
  description?: (sortHow: SortDirection) => string;
  value: T | undefined;
};
