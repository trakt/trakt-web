import * as m from '$lib/features/i18n/messages.ts';
import type {
  WatchlistButtonIntl,
  WatchlistButtonMeta,
} from './WatchlistButtonIntl.ts';

export const WatchlistButtonIntlProvider: WatchlistButtonIntl = {
  label: ({ title, isWatchlisted }: WatchlistButtonMeta) =>
    isWatchlisted
      ? m.remove_from_watchlist_label({ title })
      : m.add_to_watchlist_label({ title }),
  text: ({ isWatchlisted }: WatchlistButtonMeta) =>
    isWatchlisted ? m.remove_from_watchlist() : m.add_to_watchlist(),
};
