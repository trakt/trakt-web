import type { ActionStyle } from '$lib/components/buttons/ActionStyle.ts';
import type { WatchlistButtonIntl } from '$lib/components/buttons/watchlist/WatchlistButtonIntl.ts';

export type WatchlistButtonProps = {
  i18n?: WatchlistButtonIntl;
  title: string;
  isWatchlistUpdating: boolean;
  isWatchlisted: boolean;
  isQueued?: boolean;
  type: ActionStyle;
  size: 'small' | 'normal';
  onAdd: () => void;
  onRemove: (event: MouseEvent) => void;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label' | 'value' | 'type'>;
