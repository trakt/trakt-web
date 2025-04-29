type FilterOption = {
  label: string;
  value: string;
};

export enum FilterKey {
  Genres = 'genres',
  IgnoreWatched = 'ignore_watched',
  IgnoreWatchlisted = 'ignore_watchlisted',
  Streaming = 'watchnow',
}

type BaseFilter = {
  key: FilterKey;
  label: string;
  type: 'list' | 'toggle';
};

export type ListFilter = BaseFilter & {
  type: 'list';
  options: Array<FilterOption>;
};

export type ToggleFilter = BaseFilter & {
  type: 'toggle';
  defaultValue: 'true' | 'false';
};

export type Filter = ListFilter | ToggleFilter;
