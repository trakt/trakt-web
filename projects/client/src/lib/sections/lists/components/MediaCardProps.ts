import type {
  MediaInput,
  MediaInputDefault,
  ShowInput,
} from '$lib/models/MediaInput.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Snippet } from 'svelte';

export type MediaItemVariant<T> =
  | { variant?: 'portrait' | 'landscape' } & MediaInput<T>
  | { variant: 'landscape' } & MediaInput<T>
  | { variant: 'activity'; date: Date } & MediaInput<T>;

type BaseItemProps<T> = MediaItemVariant<T> & {
  badge?: Snippet;
  tag?: Snippet;
  coverTag?: Snippet;
  action?: Snippet;
  popupActions?: Snippet;
  style?: 'cover' | 'summary';
  source?: string;
  onclick?: (item: T) => void;
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
