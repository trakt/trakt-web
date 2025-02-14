import type {
  MediaInput,
  MediaInputDefault,
  ShowInput,
} from '$lib/models/MediaInput.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Snippet } from 'svelte';

export type MediaItemVariant<T> =
  | { variant?: 'poster' } & MediaInput<T>
  | { variant: 'thumb' } & MediaInput<T>
  | { variant: 'activity'; date: Date } & MediaInput<T>;

type BaseItemProps<T> = MediaItemVariant<T> & {
  badges?: Snippet;
  tags?: Snippet;
  action?: Snippet;
  popupActions?: Snippet;
  style?: 'cover' | 'summary';
};

export type MediaCardProps<T = MediaInputDefault> = BaseItemProps<T> & {
  type: MediaType;
};
export type EpisodeCardProps<T = ShowInput> =
  & BaseItemProps<T>
  & {
    type: 'episode';
    episode: EpisodeEntry;
  };
