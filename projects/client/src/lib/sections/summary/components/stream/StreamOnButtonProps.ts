import type { StreamOn } from '$lib/requests/models/StreamOn.ts';
import type { MetaInfoProps } from '../media/useMediaMetaInfo.ts';

export type StreamOnButtonProps = {
  streamOn?: StreamOn;
  style: 'logo' | 'normal' | 'dropdown-item';
  size?: 'small' | 'normal';
} & MetaInfoProps;
