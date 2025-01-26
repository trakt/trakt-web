import * as m from '$lib/features/i18n/messages.ts';
import type { WatchNowServiceLogoIntl } from './WatchNowServiceLogoIntl.ts';

export const WatchNowServiceLogoIntlProvider: WatchNowServiceLogoIntl = {
  alt: (serviceName: string) =>
    m.watch_now_service_logo({ service: serviceName }),
};
