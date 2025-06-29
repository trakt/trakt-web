import * as m from '$lib/features/i18n/messages.ts';
import type { StreamingServiceButtonIntl } from './StreamingServiceButtonIntl.ts';

export const StreamingServiceButtonIntlProvider: StreamingServiceButtonIntl = {
  title: (title: string) => m.button_label_stream_on({ title }),
  streamOn: () => m.button_text_stream_on(),
};
