import type { WatchNowStreaming } from '$lib/requests/models/WatchNowServices.ts';
import type { WatchNowButtonIntl } from './WatchNowButtonIntl.ts';

export type WatchNowButtonProps = {
  mediaTitle: string;
  service: WatchNowStreaming;
  style: 'action' | 'normal';
  i18n?: WatchNowButtonIntl;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
