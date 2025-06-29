import * as m from '$lib/features/i18n/messages.ts';
import type {
  RemoveFromHistoryButtonIntl,
  RemoveFromHistoryButtonMeta,
} from './RemoveFromHistoryButtonIntl.ts';

export const RemoveFromHistoryButtonIntlProvider: RemoveFromHistoryButtonIntl =
  {
    label: ({ title }: RemoveFromHistoryButtonMeta) =>
      m.button_label_remove_from_history({ title }),
    text: () => m.button_text_remove_from_history(),
  };
