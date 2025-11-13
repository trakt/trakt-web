import type { GenreIntl } from '$lib/components/summary/GenreIntl.ts';
import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre.ts';

export const GenreIntlProvider: GenreIntl = {
  genre: (genre: string) => toTranslatedGenre(genre),
};
