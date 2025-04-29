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

export const FILTERS = [
  GENRE_FILTER,
] as const;
