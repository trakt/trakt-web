import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import { generateDecadeOptions } from '$lib/features/filters/_internal/generateDecadeOptions.ts';
import { type Filter, FilterKey } from '$lib/features/filters/models/Filter.ts';
import { languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { STAR_RATINGS } from '$lib/sections/summary/components/rating/constants/index.ts';
import { toTranslatedValue } from '$lib/utils/formatting/string/toTranslatedValue.ts';
import { GENRES } from './genres.ts';
import { getRatingFilterRange } from './getRatingFilterRange.ts';

const GENRE_FILTER: Filter = {
  label: m.header_genre(),
  key: FilterKey.Genres,
  type: 'list',
  options: [
    {
      label: m.option_text_my_favorites(),
      value: 'favorites',
      mapper: (settings: UserSettings) => {
        return settings.genres.join(',');
      },
    },
    ...GENRES
      .map((genre) => ({
        label: toTranslatedValue('genre', genre),
        value: genre,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, languageTag())),
  ],
};

const DECADE_FILTER: Filter = {
  label: m.header_decade(),
  key: FilterKey.Decade,
  type: 'list',
  options: generateDecadeOptions(),
};

const STREAMING_FILTER: Filter = {
  label: m.header_streaming(),
  key: FilterKey.Streaming,
  type: 'list',
  options: [
    { label: m.option_text_my_favorites(), value: 'favorites' },
    {
      label: m.option_text_streaming_now(),
      value: 'subscriptions',
    },
    { label: m.option_text_all_digital_releases(), value: 'any' },
  ],
};

const RATINGS_FILTER: Filter = {
  label: m.header_ratings(),
  key: FilterKey.Ratings,
  type: 'ratings',
  options: STAR_RATINGS.map((rating) => ({
    rating,
    value: getRatingFilterRange(rating),
  })),
};

const IGNORE_WATCHED_FILTER: Filter = {
  label: m.header_ignore_watched(),
  key: FilterKey.IgnoreWatched,
  type: 'toggle',
  defaultValue: 'false',
};

const IGNORE_WATCHLISTED_FILTER: Filter = {
  label: m.header_ignore_watchlisted(),
  key: FilterKey.IgnoreWatchlisted,
  type: 'toggle',
  defaultValue: 'false',
};

export const FILTERS = [
  GENRE_FILTER,
  STREAMING_FILTER,
  DECADE_FILTER,
  RATINGS_FILTER,
  IGNORE_WATCHED_FILTER,
  IGNORE_WATCHLISTED_FILTER,
] as const;

export const DEFAULT_TV_FILTERS = {
  [FilterKey.Streaming]: 'subscriptions',
} as const;
