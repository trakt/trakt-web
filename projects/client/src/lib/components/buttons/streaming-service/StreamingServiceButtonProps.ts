import type { StreamNow } from '../../../requests/models/StreamingServiceOptions.ts';
import type { StreamingServiceButtonIntl } from './StreamingServiceButtonIntl.ts';

export type StreamingServiceButtonProps = {
  mediaTitle: string;
  service: StreamNow;
  style: 'logo' | 'normal';
  i18n?: StreamingServiceButtonIntl;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
