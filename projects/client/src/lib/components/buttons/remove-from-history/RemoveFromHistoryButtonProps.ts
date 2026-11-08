import type { ActionStyle } from '$lib/components/buttons/ActionStyle.ts';
import type { RemoveFromHistoryButtonIntl } from './RemoveFromHistoryButtonIntl.ts';

export type RemoveFromHistoryButtonProps = {
  i18n?: RemoveFromHistoryButtonIntl;
  title: string;
  isRemoving: boolean;
  style: ActionStyle;
  size: 'normal' | 'small';
  onRemove: (event: MouseEvent) => void;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
