export type SortDirection = 'asc' | 'desc';

export type SortBy = {
  label: string;
  value: string | undefined;
};

export type Sorting = {
  sortBy: SortBy;
  sortHow?: SortDirection;
};
