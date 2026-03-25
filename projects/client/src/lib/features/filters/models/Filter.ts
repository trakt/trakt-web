import type {
  AdvancedOption,
  AdvancedSliderOption,
  FilterOption,
  MultiSelectOption,
  SliderOption,
} from './FilterOptions.ts';

export enum FilterKey {
  Genres = 'genres',
  Certifications = 'certifications',
  Countries = 'countries',
  IgnoreWatched = 'ignore_watched',
  IgnoreWatchlisted = 'ignore_watchlisted',
  Streaming = 'watchnow',
  Decade = 'years',
  Ratings = 'ratings',
  Runtime = 'runtimes',
  ImdbRatings = 'imdb_ratings',
  RtMeter = 'rt_meters',
  RtUserMeter = 'rt_user_meters',
}

type BaseFilter = {
  key: FilterKey;
  label: string;
  type: 'list' | 'toggle' | 'slider';
};

export type ListFilter = BaseFilter & {
  type: 'list';
  options: Array<FilterOption>;
  advanced: AdvancedOption;
};

export type ToggleFilter = BaseFilter & {
  type: 'toggle';
};

export type RatingsFilter =
  & Omit<BaseFilter, 'label'>
  & SliderOption
  & {
    advanced: AdvancedSliderOption;
  };

export type Filter = ListFilter | ToggleFilter | RatingsFilter;

type AdvancedFilter = Extract<Filter, { advanced: AdvancedOption }>;

export type AdvancedSliderFilter = AdvancedFilter & {
  advanced: AdvancedSliderOption;
};

export type AdvancedMultiSelectFilter = ListFilter & {
  advanced: MultiSelectOption;
};
