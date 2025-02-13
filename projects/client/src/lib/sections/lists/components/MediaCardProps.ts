import type { MediaInput, MediaInputDefault } from '$lib/models/MediaInput.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Snippet } from 'svelte';

export type MediaItemVariant<T> =
  | { variant?: 'poster' } & MediaInput<T>
  | { variant: 'thumb' } & MediaInput<T>
  | { variant: 'activity'; date: Date } & MediaInput<T>;

export type MediaCardProps<T = MediaInputDefault> = MediaItemVariant<T> & {
  type: MediaType;
  tags?: Snippet<[MediaInput<T>['media']]>;
  action?: Snippet;
  popupActions?: Snippet;
  style?: 'cover' | 'summary';
};
