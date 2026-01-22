import * as m from '$lib/features/i18n/messages.ts';
import type {
  MarkAsWatchedButtonIntl,
  MarkAsWatchedButtonMeta,
} from './MarkAsWatchedButtonIntl.ts';

export const MarkAsWatchedButtonIntlProvider: MarkAsWatchedButtonIntl = {
  label: ({ isWatched, title }: MarkAsWatchedButtonMeta) =>
    isWatched
      ? m.button_label_remove_from_watched({ title })
      : m.button_label_mark_as_watched({ title }),
  text: ({ isWatched, isRewatching }: MarkAsWatchedButtonMeta) => {
    const isRemovable = isWatched && !isRewatching;

    if (isRemovable) {
      return m.button_text_remove_from_history();
    }

    return isRewatching ? m.button_text_watch_again() : m.button_text_track();
  },
};
