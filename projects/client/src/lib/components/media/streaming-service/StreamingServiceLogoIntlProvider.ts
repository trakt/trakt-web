import * as m from '$lib/features/i18n/messages.ts';
import type { StreamingServiceLogoIntl } from './StreamingServiceLogoIntl.ts';

export const StreamingServiceLogoIntlProvider: StreamingServiceLogoIntl = {
  alt: (serviceName: string) =>
    m.streaming_service_logo({ service: serviceName }),
};
