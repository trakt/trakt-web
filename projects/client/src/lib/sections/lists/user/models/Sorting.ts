import type { SortBy } from './SortBy.ts';

export type Sorting<T = SortBy> = {
  text: () => string;
  label: () => string;
  description?: () => string;
  value: T | undefined;
};
