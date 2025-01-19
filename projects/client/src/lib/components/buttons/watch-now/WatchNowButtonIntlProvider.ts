import * as m from '$lib/features/i18n/messages.ts';
import type {
  WatchNowButtonIntl,
  WatchNowButtonMeta,
} from './WatchNowButtonIntl.ts';

export const WatchNowButtonIntlProvider: WatchNowButtonIntl = {
  title: (title: string) => m.watch_title_now({ title }),
  watchNow: () => m.watch_now(),
  watchOnMultiple: ({ count, isDisabled }: WatchNowButtonMeta) =>
    isDisabled ? m.watch_on_nowhere() : m.watch_on_multiple_services({ count }),
  logoAlt: (serviceName: string) =>
    m.watch_now_service_logo({ service: serviceName }),
};
