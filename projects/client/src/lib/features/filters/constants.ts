import type { Filter } from '$lib/features/filters/models/Filter.ts';
import { languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { toTranslatedValue } from '$lib/utils/formatting/string/toTranslatedValue.ts';
import { genreOptionSchema } from '@trakt/api';

const GENRE_FILTER: Filter = {
  label: m.genre(),
  key: 'genres',
  type: 'list',
  options: genreOptionSchema.options
    .map((genre) => ({
      label: toTranslatedValue('genre', genre),
      value: genre,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, languageTag())),
};

const IGNORE_WATCHED_FILTER: Filter = {
  label: m.ignore_watched(),
  key: 'ignore_watched',
  type: 'toggle',
  defaultValue: 'true',
};

const IGNORE_WATCHLISTED_FILTER: Filter = {
  label: m.ignore_watchlisted(),
  key: 'ignore_watchlisted',
  type: 'toggle',
  defaultValue: 'true',
};

export const FILTERS = [
  GENRE_FILTER,
  IGNORE_WATCHED_FILTER,
  IGNORE_WATCHLISTED_FILTER,
] as const;
