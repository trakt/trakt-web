import type { WatchlistButtonIntl } from '$lib/components/buttons/watchlist/WatchlistButtonIntl.ts';
import type { Snippet } from 'svelte';

export type WatchlistButtonProps = {
  i18n?: WatchlistButtonIntl;
  title: string;
  isWatchlistUpdating: boolean;
  isWatchlisted: boolean;
  isQueued?: boolean;
  type: 'action' | 'normal' | 'dropdown-item';
  size: 'small' | 'normal';
  onAdd: () => void;
  onRemove: (event: MouseEvent) => void;
  // Trailing action segment - only rendered for the dropdown-item type.
  action?: Snippet;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label' | 'value' | 'type'>;
