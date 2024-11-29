import * as m from '$lib/features/i18n/messages.ts';
import type { WatchlistButtonIntl } from './WatchlistButtonIntl.ts';

export type WatchlistButtonMeta = {
  isWatchlisted: boolean;
  title: string;
};

export const WatchlistButtonIntlProvider: WatchlistButtonIntl = {
  label: ({ title, isWatchlisted }: WatchlistButtonMeta) =>
    isWatchlisted
      ? m.remove_from_watchlist_label({ title })
      : m.add_to_watchlist_label({ title }),
  text: ({ isWatchlisted }: WatchlistButtonMeta) =>
    isWatchlisted ? m.remove_from_watchlist() : m.add_to_watchlist(),
};
