import type { SortBy } from './SortBy.ts';

export type Sorting = {
  text: () => string;
  label: () => string;
  value: SortBy | undefined;
};
