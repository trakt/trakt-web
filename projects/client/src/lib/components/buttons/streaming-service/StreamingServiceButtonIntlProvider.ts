import * as m from '$lib/features/i18n/messages.ts';
import type { StreamingServiceButtonIntl } from './StreamingServiceButtonIntl.ts';

export const StreamingServiceButtonIntlProvider: StreamingServiceButtonIntl = {
  title: (title: string) => m.watch_title_now({ title }),
  streamOn: () => m.stream_on(),
};
