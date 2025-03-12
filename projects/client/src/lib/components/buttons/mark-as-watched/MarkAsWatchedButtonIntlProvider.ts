import * as m from '$lib/features/i18n/messages.ts';
import type {
  MarkAsWatchedButtonIntl,
  MarkAsWatchedButtonMeta,
} from './MarkAsWatchedButtonIntl.ts';

export const MarkAsWatchedButtonIntlProvider: MarkAsWatchedButtonIntl = {
  label: ({ isWatched, title }: MarkAsWatchedButtonMeta) =>
    isWatched
      ? m.remove_from_watched_label({ title })
      : m.mark_as_watched_label({ title }),
  text: ({ isWatched, isRewatching }: MarkAsWatchedButtonMeta) => {
    const isRemovable = isWatched && !isRewatching;

    if (isRemovable) {
      return m.remove_from_watched();
    }

    return isRewatching ? m.watch_again() : m.mark_as_watched();
  },
};
