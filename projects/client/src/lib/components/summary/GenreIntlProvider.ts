import type { GenreIntl } from '$lib/components/summary/GenreIntl.ts';
import { toTranslatedValue } from '$lib/utils/formatting/string/toTranslatedValue.ts';

export const GenreIntlProvider: GenreIntl = {
  genre: (genre: string) => toTranslatedValue('genre', genre),
};
