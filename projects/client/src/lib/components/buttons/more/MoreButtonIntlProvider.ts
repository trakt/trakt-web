import * as m from '$lib/features/i18n/messages.ts';
import type { MoreButtonIntl } from './MoreButtonIntl.ts';

export const MoreButtonIntlProvider: MoreButtonIntl = {
  more: (count: number | Nil) => m.button_text_more({ count: count ?? '' }),
};
