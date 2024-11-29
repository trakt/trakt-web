import type { WatchlistButtonIntl } from '$lib/components/buttons/watchlist/WatchlistButtonIntl.ts';

export type WatchlistButtonProps = {
  i18n?: WatchlistButtonIntl;
  title: string;
  isAddingToWatchlist: boolean;
  isWatchlisted: boolean;
  onAdd: () => void;
  onRemove: () => void;
} & Omit<ButtonProps, 'children' | 'onclick' | 'label'>;
