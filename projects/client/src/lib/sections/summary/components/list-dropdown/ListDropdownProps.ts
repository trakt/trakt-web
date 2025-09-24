import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';

export type ListDropdownProps = MediaStoreProps & {
  size?: 'normal' | 'small';
  style?: 'normal' | 'popup';
  title: string;
};
