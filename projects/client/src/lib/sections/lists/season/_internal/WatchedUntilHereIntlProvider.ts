import type {
  MarkAsWatchedButtonIntl,
  MarkAsWatchedButtonMeta,
} from '$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonIntl.ts';
import * as m from '$lib/features/i18n/messages.ts';

export const WatchedUntilHereIntlProvider: MarkAsWatchedButtonIntl = {
  label: ({ isWatched, title }: MarkAsWatchedButtonMeta) =>
    isWatched
      ? m.button_label_remove_from_watched({ title })
      : m.button_label_watched_until_here({ title }),
  text: ({ isWatched }: MarkAsWatchedButtonMeta) =>
    isWatched
      ? m.button_text_remove_from_history()
      : m.button_text_watched_until_here(),
};
