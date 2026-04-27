import type { SortBy } from './SortBy.ts';

export type Sorting<T = SortBy> = {
  text: () => string;
  label: () => string;
  value: T | undefined;
};
