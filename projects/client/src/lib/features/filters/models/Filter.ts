type FilterOption = {
  label: string;
  value: string;
};

export type FilterKey = 'genres';

type BaseFilter = {
  key: FilterKey;
  label: string;
  type: 'list';
};

export type ListFilter = BaseFilter & {
  type: 'list';
  options: Array<FilterOption>;
};

export type Filter = ListFilter;
