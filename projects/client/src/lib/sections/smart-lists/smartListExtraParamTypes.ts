import type { FilterKey } from '$lib/features/filters/models/Filter.ts';
import type { SmartListFilters } from '$lib/requests/models/SmartListFilters.ts';

type ExtraKey = Exclude<keyof SmartListFilters, `${FilterKey}`>;

export const SMART_LIST_EXTRA_PARAM_TYPES: Readonly<
  Record<ExtraKey, 'list' | 'range' | 'boolean' | 'number' | 'text'>
> = {
  genres_operator: 'text',
  subgenres: 'list',
  languages: 'list',
  networks: 'list',
  keywords: 'list',
  keywords_operator: 'text',
  studios: 'list',
  people: 'list',
  people_operator: 'text',
  people_role: 'text',
  watchnow_country: 'text',
  released_within_days: 'number',
  letterboxd_ratings: 'range',
  mal_ratings: 'range',
  tmdb_ratings: 'range',
  metascores: 'range',
  votes: 'range',
  imdb_votes: 'range',
  parental_include_unrated: 'boolean',
  ignore_watching: 'boolean',
  ignore_unreleased: 'boolean',
  ignore_released: 'boolean',
  ignore_ended: 'boolean',
  ignore_airing: 'boolean',
  ignore_no_release_date: 'boolean',
};
