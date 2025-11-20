import type { MarkAsWatchedButtonIntl } from '$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonIntl.ts';

export type MarkAsWatchedButtonProps = {
  i18n?: MarkAsWatchedButtonIntl;
  title: string;
  isMarkingAsWatched: boolean;
  isWatched: boolean;
  style: 'action' | 'normal' | 'dropdown-item';
  size: 'normal' | 'small';
  onWatch: (event: MouseEvent) => void;
  onRemove: (event: MouseEvent) => void;
  onAsk: (event: MouseEvent) => void;
  mode?: 'act' | 'hybrid' | 'ask';
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
