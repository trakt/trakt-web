import type {
  AdvancedOption,
  FilterOption,
  MultiSelectOption,
  RatingOption,
  SliderOption,
} from './FilterOptions.ts';

export enum FilterKey {
  Genres = 'genres',
  IgnoreWatched = 'ignore_watched',
  IgnoreWatchlisted = 'ignore_watchlisted',
  Streaming = 'watchnow',
  Decade = 'years',
  Ratings = 'ratings',
  Runtime = 'runtimes',
}

type BaseFilter = {
  key: FilterKey;
  label: string;
  type: 'list' | 'toggle' | 'ratings';
};

export type ListFilter = BaseFilter & {
  type: 'list';
  options: Array<FilterOption>;
  advanced: AdvancedOption;
};

export type ToggleFilter = BaseFilter & {
  type: 'toggle';
};

export type RatingsFilter = BaseFilter & {
  type: 'ratings';
  options: Array<RatingOption>;
  advanced: SliderOption;
};

export type Filter = ListFilter | ToggleFilter | RatingsFilter;

type AdvancedFilter = Extract<Filter, { advanced: AdvancedOption }>;

export type AdvancedSliderFilter = AdvancedFilter & {
  advanced: SliderOption;
};

export type AdvancedMultiSelectFilter = ListFilter & {
  advanced: MultiSelectOption;
};
