import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import type { Writable } from 'svelte/store';

export type WatchlistActionProps = {
  style?: 'action' | 'normal' | 'dropdown-item';
  size?: 'small' | 'normal';
  title: string;
  isUpdating?: Writable<boolean>;
  isLoadingLists?: boolean;
} & MediaStoreProps;
