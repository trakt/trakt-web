import type { WatchlistButtonIntl } from '$lib/components/buttons/watchlist/WatchlistButtonIntl.ts';

export type WatchlistButtonProps = {
  i18n?: WatchlistButtonIntl;
  title: string;
  isWatchlistUpdating: boolean;
  isWatchlisted: boolean;
  type: 'action' | 'normal' | 'dropdown-item';
  size: 'small' | 'normal';
  onAdd: () => void;
  onRemove: (event: MouseEvent) => void;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label' | 'value' | 'type'>;
