import type { GenreIntl } from '$lib/components/summary/GenreIntl.ts';
import * as m from '$lib/features/i18n/messages.ts';

type IntlStore = Record<string, () => string>;

export const GenreIntlProvider: GenreIntl = {
  genre: (genre: string) => {
    const messages = m as unknown as IntlStore;

    const key = `genre_${
      genre.toLocaleLowerCase().replaceAll(' ', '_')
    }` as const;

    return messages[key]?.() ?? genre;
  },
};
