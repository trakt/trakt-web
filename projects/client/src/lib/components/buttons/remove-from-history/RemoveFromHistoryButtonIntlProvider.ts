import * as m from '$lib/features/i18n/messages.ts';
import type {
  RemoveFromHistoryButtonIntl,
  RemoveFromHistoryButtonMeta,
} from './RemoveFromHistoryButtonIntl.ts';

export const RemoveFromHistoryButtonIntlProvider: RemoveFromHistoryButtonIntl =
  {
    label: ({ title }: RemoveFromHistoryButtonMeta) =>
      m.remove_single_watched_label({ title }),
    text: () => m.remove_from_watched(),
  };
