import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';

export type ListDropdownProps = MediaStoreProps & {
  style?: 'normal' | 'action';
  title: string;
};
