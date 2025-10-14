import type { RemoveFromHistoryButtonIntl } from './RemoveFromHistoryButtonIntl.ts';

export type RemoveFromHistoryButtonProps = {
  i18n?: RemoveFromHistoryButtonIntl;
  title: string;
  isRemoving: boolean;
  style: 'action' | 'normal' | 'dropdown-item';
  size: 'normal' | 'small';
  onRemove: (event: MouseEvent) => void;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
