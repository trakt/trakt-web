import type {
  AdvancedOption,
  AdvancedSliderOption,
  FilterOption,
  MultiSelectOption,
  SliderOption,
} from './FilterOptions.ts';
import type { DiscoverMode } from './DiscoverMode.ts';
import type { FilterSurface } from './FilterSurface.ts';

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
  Status = 'statuses',
  EpisodeTypes = 'episode_types',
}

type BaseFilter = {
  key: FilterKey;
  label: () => string;
  type: 'list' | 'toggle' | 'slider';
  /*
    Restricts the filter to the named surfaces. Omitted means every surface -
    that is the norm; only filters whose API support is scoped to one feed
    declare it.
  */
  surfaces?: ReadonlyArray<FilterSurface>;
  /*
    Restricts the filter to the named discover modes. Omitted means every mode;
    declare it when the filter has nothing to narrow for one of the media
    types, the way an episode role does not apply to a movie.
  */
  modes?: ReadonlyArray<DiscoverMode>;
  /*
    Applied to the fetched result set instead of being sent upstream. Keeps the
    key out of `filterMap`, so it never reaches a request that has no parameter
    for it, and out of the query dependencies, so toggling it never refetches.
  */
  isClientSide?: boolean;
};

export type ListFilter = BaseFilter & {
  type: 'list';
  options: Array<FilterOption>;
  advanced: AdvancedOption;
};

export type ToggleFilter = BaseFilter & {
  type: 'toggle';
  isInverted?: boolean;
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
