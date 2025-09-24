import type { MetaInfoProps } from '../../../sections/summary/components/media/useMediaMetaInfo.ts';
import type { StreamingServiceButtonIntl } from '../streaming-service/StreamingServiceButtonIntl.ts';

export type PlexButtonProps =
  & {
    target: MetaInfoProps;
    style: 'logo' | 'normal' | 'dropdown-item';
    size?: 'small' | 'normal';
    i18n?: StreamingServiceButtonIntl;
  }
  & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
