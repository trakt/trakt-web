import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import type { StarRating } from '$lib/sections/summary/components/rating/models/StarRating.ts';

type FilterValueMapper = {
  mapper?: (user: UserSettings) => string;
};

export type FilterOption = {
  label: string;
  value: string;
} & FilterValueMapper;

type RatingOption = {
  rating: StarRating;
  value: string;
} & FilterValueMapper;

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
};

export type ToggleFilter = BaseFilter & {
  type: 'toggle';
  defaultValue: 'true' | 'false';
};

export type RatingsFilter = BaseFilter & {
  type: 'ratings';
  options: Array<RatingOption>;
};

export type Filter = ListFilter | ToggleFilter | RatingsFilter;
