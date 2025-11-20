import type { MarkAsWatchedButtonIntl } from '$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonIntl.ts';
import { type MarkAsWatchedStoreProps } from './useMarkAsWatched.ts';

export type MarkAsWatchedActionProps = {
  style: 'normal' | 'action' | 'dropdown-item';
  title: string;
  size?: 'normal' | 'small';
  i18n?: MarkAsWatchedButtonIntl;
  mode?: 'act' | 'hybrid' | 'ask';
} & MarkAsWatchedStoreProps;
