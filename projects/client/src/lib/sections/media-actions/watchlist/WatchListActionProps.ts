import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import type { BehaviorSubject } from 'rxjs';

export type WatchlistActionProps = {
  style?: 'action' | 'normal' | 'dropdown-item';
  size?: 'small' | 'normal';
  title: string;
  isUpdating?: BehaviorSubject<boolean>;
  isLoadingLists?: boolean;
} & MediaStoreProps;
