import * as m from '$lib/features/i18n/messages.ts';
import type { WatchNowButtonIntl } from './WatchNowButtonIntl.ts';

export const WatchNowButtonIntlProvider: WatchNowButtonIntl = {
  title: (title: string) => m.watch_title_now({ title }),
  watchNow: () => m.watch_now(),
};
