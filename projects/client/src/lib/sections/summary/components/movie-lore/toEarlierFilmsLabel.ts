import * as m from '$lib/features/i18n/messages.ts';

export function toEarlierFilmsLabel(count: number) {
  return count === 1
    ? m.text_movie_lore_earlier_films_one({ count })
    : m.text_movie_lore_earlier_films_other({ count });
}
