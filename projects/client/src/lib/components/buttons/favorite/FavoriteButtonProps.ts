import type { FavoriteButtonIntl } from './FavoriteButtonIntl.ts';

export type FavoriteButtonProps = {
  i18n?: FavoriteButtonIntl;
  title: string;
  isFavoriteUpdating: boolean;
  isFavorited: boolean;
  style: 'action' | 'normal' | 'dropdown-item';
  onAdd: () => void;
  onRemove: () => void;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
