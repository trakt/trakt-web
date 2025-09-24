import type { StreamNow } from '../../../requests/models/StreamingServiceOptions.ts';
import type { StreamingServiceButtonIntl } from './StreamingServiceButtonIntl.ts';

export type StreamingServiceButtonProps = {
  mediaTitle: string;
  service: StreamNow;
  style: 'logo' | 'normal' | 'dropdown-item';
  i18n?: StreamingServiceButtonIntl;
  size?: 'small' | 'normal';
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
