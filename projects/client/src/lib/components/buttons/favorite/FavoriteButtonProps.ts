import type { DpadNavigationType } from '$lib/features/navigation/models/DpadNavigationType.ts';
import type { FavoriteButtonIntl } from './FavoriteButtonIntl.ts';

export type FavoriteButtonProps = {
  i18n?: FavoriteButtonIntl;
  title: string;
  isFavoriteUpdating: boolean;
  isFavorited: boolean;
  style: 'action' | 'normal' | 'dropdown-item';
  onAdd: () => void;
  onRemove: () => void;
  navigationType?: DpadNavigationType;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
