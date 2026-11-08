import type { ActionStyle } from '$lib/components/buttons/ActionStyle.ts';
import type { MarkAsWatchedButtonIntl } from '$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonIntl.ts';

export type MarkAsWatchedButtonProps = {
  i18n?: MarkAsWatchedButtonIntl;
  title: string;
  isMarkingAsWatched: boolean;
  isWatched: boolean;
  isQueued?: boolean;
  isLoading?: boolean;
  style: ActionStyle;
  size: 'normal' | 'small';
  onWatch: (event: MouseEvent) => void;
  onRemove: (event: MouseEvent) => void;
  onAsk: (event: MouseEvent) => void;
  mode?: 'act' | 'hybrid' | 'ask';
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
