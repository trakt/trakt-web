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
import { generateCountryOptions } from './generateCountryOptions.ts';
import { generateRegionOptions } from './generateRegionOptions.ts';
import { generateRuntimeOptions } from './generateRuntimeOptions.ts';
import { GENRES } from './genres.ts';

export const SEASONAL_STORAGE_KEY = 'trakt_seasonal_filter';
export const DISCOVER_MODE_PARAM = 'mode';

const GENRE_FILTER: Filter = {
  label: m.header_genre,
  key: FilterKey.Genres,
  type: 'list',
  options: [
    {
      label: m.option_text_my_favorites,
      value: 'favorites',
      mapper: (settings: UserSettings) => {
        return settings.genres.join(',');
      },
    },
    ...GENRES
      .map((genre) => ({
        label: () => toTranslatedGenre(genre),
        value: genre,
      }))
      .toSorted((a, b) => a.label().localeCompare(b.label(), languageTag())),
  ],
  advanced: {
    type: 'multi-select',
  },
};

const DECADE_FILTER: Filter = {
  label: m.header_decade,
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
  label: m.header_runtime,
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
  label: m.header_streaming,
  key: FilterKey.Streaming,
  type: 'list',
  options: [
    { label: m.option_text_my_favorites, value: 'favorites' },
    {
      label: m.option_text_streaming_now,
      value: 'subscriptions',
    },
    { label: m.list_title_streaming_free, value: 'free' },
    { label: m.option_text_all_digital_releases, value: 'any' },
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
    additionalKeys: [
      {
        key: FilterKey.ImdbRatings,
        mapper: ({ min, max }) => `${min / 10}-${max / 10}`,
      },
      { key: FilterKey.RtMeter },
      { key: FilterKey.RtUserMeter },
    ],
  },
};

const IGNORE_WATCHED_FILTER: Filter = {
  label: m.tag_text_watched,
  key: FilterKey.IgnoreWatched,
  type: 'toggle',
  isInverted: true,
};

const IGNORE_WATCHLISTED_FILTER: Filter = {
  label: m.tag_text_watchlisted,
  key: FilterKey.IgnoreWatchlisted,
  type: 'toggle',
  isInverted: true,
};

const CERTIFICATION_FILTER: Filter = {
  label: m.header_certification,
  key: FilterKey.Certifications,
  type: 'list',
  options: [
    {
      label: m.option_text_certification_all_ages,
      value: 'all_ages',
      mapper: () => 'g,tv-y,tv-y7,tv-g',
    },
    {
      label: m.option_text_certification_parental_guidance,
      value: 'parental_guidance',
      mapper: () => 'pg,tv-pg',
    },
    {
      label: m.option_text_certification_teens,
      value: 'teens',
      mapper: () => 'pg-13,tv-14',
    },
    {
      label: m.option_text_certification_mature,
      value: 'mature',
      mapper: () => 'r,tv-ma',
    },
    {
      label: m.option_text_certification_unrated,
      value: 'unrated',
      mapper: () => 'nr',
    },
  ],
  advanced: {
    type: 'multi-select',
  },
};

const COUNTRY_FILTER: Filter = {
  label: m.header_region,
  key: FilterKey.Countries,
  type: 'list',
  options: generateRegionOptions(),
  advanced: {
    type: 'multi-select',
    label: m.header_country,
    options: generateCountryOptions(),
  },
};

const STATUS_FILTER: Filter = {
  label: m.header_status,
  key: FilterKey.Status,
  type: 'list',
  options: [
    {
      label: m.translated_value_status_released,
      value: 'returning series,continuing,released',
    },
    {
      label: m.translated_value_status_upcoming,
      value: 'upcoming,in production,planned,post production',
    },
    { label: m.translated_value_status_ended, value: 'ended' },
    { label: m.translated_value_status_canceled, value: 'canceled' },
    { label: m.translated_value_status_rumored, value: 'rumored' },
  ],
  advanced: {
    type: 'multi-select',
    options: [
      {
        label: m.translated_value_status_returning_series,
        value: 'returning series',
      },
      { label: m.translated_value_status_released, value: 'released' },
      { label: m.translated_value_status_continuing, value: 'continuing' },
      { label: m.translated_value_status_upcoming, value: 'upcoming' },
      {
        label: m.translated_value_status_in_production,
        value: 'in production',
      },
      {
        label: m.translated_value_status_post_production,
        value: 'post production',
      },
      { label: m.translated_value_status_planned, value: 'planned' },
      { label: m.translated_value_status_ended, value: 'ended' },
      { label: m.translated_value_status_canceled, value: 'canceled' },
      { label: m.translated_value_status_rumored, value: 'rumored' },
    ],
  },
};

export const FILTERS = [
  GENRE_FILTER,
  STREAMING_FILTER,
  DECADE_FILTER,
  RUNTIME_FILTER,
  RATINGS_FILTER,
  CERTIFICATION_FILTER,
  COUNTRY_FILTER,
  STATUS_FILTER,
  IGNORE_WATCHED_FILTER,
  IGNORE_WATCHLISTED_FILTER,
] as const;
