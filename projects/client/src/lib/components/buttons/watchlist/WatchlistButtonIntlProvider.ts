import * as m from '$lib/features/i18n/messages.ts';
import type {
  WatchlistButtonIntl,
  WatchlistButtonMeta,
} from './WatchlistButtonIntl.ts';

export const WatchlistButtonIntlProvider: WatchlistButtonIntl = {
  label: ({ title, isWatchlisted }: WatchlistButtonMeta) =>
    isWatchlisted
      ? m.button_label_remove_from_watchlist({ title })
      : m.button_label_add_to_watchlist({ title }),
  text: (_: WatchlistButtonMeta) => m.button_text_watchlist(),
};
