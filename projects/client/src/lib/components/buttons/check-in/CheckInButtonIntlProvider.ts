import * as m from '$lib/features/i18n/messages.ts';
import type {
  CheckInButtonIntl,
  CheckInButtonMeta,
} from './CheckInButtonIntl.ts';

export const CheckInButtonIntlProvider: CheckInButtonIntl = {
  label: ({ title }: CheckInButtonMeta) => m.checkin_label({ title }),
  text: () => m.checkin(),
};
