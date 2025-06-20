import type {
  MarkAsWatchedButtonIntl,
  MarkAsWatchedButtonMeta,
} from '$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonIntl.ts';
import * as m from '$lib/features/i18n/messages.ts';

export const WatchedUntilHereIntlProvider: MarkAsWatchedButtonIntl = {
  label: ({ isWatched, title }: MarkAsWatchedButtonMeta) =>
    isWatched
      ? m.remove_from_watched_label({ title })
      : m.mark_as_watched_until_label({ title }),
  text: ({ isWatched }: MarkAsWatchedButtonMeta) =>
    isWatched ? m.remove_from_watched() : m.mark_as_watched_until(),
};
