import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';

export type WatchlistActionProps = {
  style?: 'action' | 'normal' | 'dropdown-item';
  size?: 'small' | 'normal';
  title: string;
  isLoadingLists?: boolean;
} & MediaStoreProps;
