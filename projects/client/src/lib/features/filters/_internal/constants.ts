import { generateDecadeOptions } from '$lib/features/filters/_internal/generateDecadeOptions.ts';
import { RATINGS } from '$lib/features/filters/_internal/ratings.ts';
import { type Filter, FilterKey } from '$lib/features/filters/models/Filter.ts';
import { languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { SimpleRating } from '$lib/models/SimpleRating.ts';
import { toTranslatedValue } from '$lib/utils/formatting/string/toTranslatedValue.ts';
import { GENRES } from './genres.ts';

const GENRE_FILTER: Filter = {
  label: m.genre(),
  key: FilterKey.Genres,
  type: 'list',
  options: GENRES
    .map((genre) => ({
      label: toTranslatedValue('genre', genre),
      value: genre,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, languageTag())),
};

const DECADE_FILTER: Filter = {
  label: m.decade(),
  key: FilterKey.Decade,
  type: 'list',
  options: generateDecadeOptions(),
};

// FIXME: add this filter back when filter is fixed server side
/*
const STREAMING_FILTER: Filter = {
  label: m.streaming(),
  key: FilterKey.Streaming,
  type: 'list',
  options: [
    { label: m.watchnow_favorites_only(), value: 'favorites' },
    {
      label: m.watchnow_streaming(),
      value: 'subscriptions',
    },
    { label: m.watchnow_digital_release(), value: 'any' },
  ],
};
*/

const RATINGS_FILTER: Filter = {
  label: m.ratings(),
  key: FilterKey.Ratings,
  type: 'ratings',
  options: Object.values(SimpleRating).map((rating) => ({
    rating,
    value: RATINGS[rating as SimpleRating],
  })),
};

const IGNORE_WATCHED_FILTER: Filter = {
  label: m.ignore_watched(),
  key: FilterKey.IgnoreWatched,
  type: 'toggle',
  defaultValue: 'true',
};

const IGNORE_WATCHLISTED_FILTER: Filter = {
  label: m.ignore_watchlisted(),
  key: FilterKey.IgnoreWatchlisted,
  type: 'toggle',
  defaultValue: 'true',
};

export const FILTERS = [
  GENRE_FILTER,
  // STREAMING_FILTER,
  DECADE_FILTER,
  RATINGS_FILTER,
  IGNORE_WATCHED_FILTER,
  IGNORE_WATCHLISTED_FILTER,
] as const;

export const DEFAULT_TV_FILTERS = {
  // [FilterKey.Streaming]: 'any_subscriptions',
} as const;
