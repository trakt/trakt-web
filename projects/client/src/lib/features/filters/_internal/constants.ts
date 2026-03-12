import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import {
  generateDecadeOptions,
  generateDecadeRange,
} from '$lib/features/filters/_internal/generateDecadeOptions.ts';
import { type Filter, FilterKey } from '$lib/features/filters/models/Filter.ts';
import { languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre.ts';
import { toPercentage } from '../../../utils/formatting/number/toPercentage.ts';
import { generateRuntimeOptions } from './generateRuntimeOptions.ts';
import { GENRES } from './genres.ts';

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
        label: toTranslatedGenre(genre),
        value: genre,
      }))
      .toSorted((a, b) => a.label.localeCompare(b.label, languageTag())),
  ],
  advanced: {
    type: 'multi-select',
  },
};

const DECADE_FILTER: Filter = {
  label: m.header_decade(),
  key: FilterKey.Decade,
  type: 'list',
  options: generateDecadeOptions(),
  advanced: {
    type: 'slider',
    range: generateDecadeRange(),
    formatLabel: m.advanced_filter_label_release_year,
  },
};

const RUNTIME_FILTER: Filter = {
  label: m.header_runtime(),
  key: FilterKey.Runtime,
  type: 'list',
  options: generateRuntimeOptions(),
  advanced: {
    type: 'slider',
    range: { min: 0, max: 500 },
    formatLabel: m.advanced_filter_label_runtime,
  },
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
  advanced: {
    type: 'multi-select',
  },
};

const toRatingPercentage = (value: number) =>
  toPercentage(value / 100, languageTag());

const RATING_OPTION = {
  type: 'slider' as const,
  range: { min: 0, max: 100 },
  ticks: {
    count: 6,
    formatter: toRatingPercentage,
  },
};

const RATINGS_FILTER: Filter = {
  key: FilterKey.Ratings,
  ...RATING_OPTION,
  formatLabel: ({ min, max }) =>
    m.filter_label_ratings({
      min: toRatingPercentage(min),
      max: toRatingPercentage(max),
    }),
  advanced: {
    ...RATING_OPTION,
    formatLabel: ({ min, max }) =>
      m.advanced_filter_label_ratings({
        min: toRatingPercentage(min),
        max: toRatingPercentage(max),
      }),
  },
};

const IGNORE_WATCHED_FILTER: Filter = {
  label: m.header_hide_watched(),
  key: FilterKey.IgnoreWatched,
  type: 'toggle',
};

const IGNORE_WATCHLISTED_FILTER: Filter = {
  label: m.header_hide_watchlisted(),
  key: FilterKey.IgnoreWatchlisted,
  type: 'toggle',
};

export const FILTERS = [
  GENRE_FILTER,
  STREAMING_FILTER,
  DECADE_FILTER,
  RUNTIME_FILTER,
  RATINGS_FILTER,
  IGNORE_WATCHED_FILTER,
  IGNORE_WATCHLISTED_FILTER,
] as const;
