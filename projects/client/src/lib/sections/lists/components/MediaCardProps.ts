import type { MediaInput, MediaInputDefault } from '$lib/models/MediaInput.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Snippet } from 'svelte';
import type { MediaStyleProps } from './MediaStyleProps.ts';

export type MediaCardProps<T = MediaInputDefault> =
  & {
    type: MediaType;
    tags?: Snippet<[MediaInput<T>['media']]>;
    action?: Snippet;
  }
  & MediaInput<T>
  & MediaStyleProps;
