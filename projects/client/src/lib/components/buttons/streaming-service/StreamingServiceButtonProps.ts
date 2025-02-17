import type { StreamNow } from '../../../requests/models/StreamingServiceOptions.ts';
import type { StreamingServiceButtonIntl } from './StreamingServiceButtonIntl.ts';

export type StreamingServiceButtonProps = {
  mediaTitle: string;
  service: StreamNow;
  style: 'action' | 'normal';
  i18n?: StreamingServiceButtonIntl;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
