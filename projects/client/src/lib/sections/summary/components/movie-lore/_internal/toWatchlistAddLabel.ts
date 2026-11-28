import * as m from '$lib/features/i18n/messages.ts';

export function toWatchlistAddLabel(count: number) {
  switch (count) {
    case 1:
      return m.text_movie_lore_watchlist_add_one();
    case 2:
      return m.text_movie_lore_watchlist_add_two();
    default:
      return m.text_movie_lore_watchlist_add_other({ count });
  }
}
