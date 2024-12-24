import * as m from '$lib/features/i18n/messages.ts';
import type {
  WatchNowButtonIntl,
  WatchNowButtonMeta,
} from './WatchNowButtonIntl.ts';

export const WatchNowButtonIntlProvider: WatchNowButtonIntl = {
  title: ({ title, isDisabled }: WatchNowButtonMeta) =>
    isDisabled
      ? m.watch_title_now_disabled({ title })
      : m.watch_title_now({ title }),
  text: () => m.watch_now(),
};
