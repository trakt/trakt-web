import type { FavoriteButtonIntl } from './FavoriteButtonIntl';

export type FavoriteButtonProps = {
  i18n?: FavoriteButtonIntl;
  title: string;
  isFavoriteUpdating: boolean;
  isFavorited: boolean;
  type: 'action' | 'normal';
  onAdd: () => void;
  onRemove: () => void;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
