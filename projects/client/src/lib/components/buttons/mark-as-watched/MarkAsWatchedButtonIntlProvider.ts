import * as m from '$lib/features/i18n/messages.ts';
import type {
  MarkAsWatchedButtonIntl,
  MarkAsWatchedButtonMeta,
} from './MarkAsWatchedButtonIntl.ts';

export const MarkAsWatchedButtonIntlProvider: MarkAsWatchedButtonIntl = {
  label: ({ title }: MarkAsWatchedButtonMeta) =>
    m.mark_as_watched_label({ title }),
  text: (_: MarkAsWatchedButtonMeta) => m.mark_as_watched(),
};
