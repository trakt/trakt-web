import type { GenreFilter } from '$lib/features/filters/models/GenreFilter.ts';
import { languageTag } from '$lib/features/i18n/index.ts';
import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { toTranslatedValue } from '$lib/utils/formatting/string/toTranslatedValue.ts';
import { genreOptionSchema } from '@trakt/api';
import { derived, readable } from 'svelte/store';

const GENRE_FILTER: GenreFilter = {
  key: 'genres',
  options: genreOptionSchema.options
    .map((genre) => ({
      label: toTranslatedValue('genre', genre),
      value: genre,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, languageTag())),
};

export function useFilter() {
  const { search } = useParameters();

  return {
    filter: readable(GENRE_FILTER),
    currentValue: derived(search, ($search) => {
      return $search.get(GENRE_FILTER.key);
    }),
    filterMap: derived(search, ($search) => {
      const value = $search.get(GENRE_FILTER.key);

      if (!value) {
        return {};
      }

      return {
        [GENRE_FILTER.key]: value,
      };
    }),
  };
}
