import type { MediaInput, MediaInputDefault } from '$lib/models/MediaInput.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Snippet } from 'svelte';
import type { BaseItemProps } from './BaseItemProps.ts';

export type MediaItemVariant<T> =
  | { variant?: Nil } & MediaInput<T>
  | { variant: 'activity'; date: Date } & MediaInput<T>
  | { variant: 'next'; progress: number; minutesLeft: number } & MediaInput<T>
  | { variant: 'start' } & MediaInput<T>
  | { variant: 'credit'; role: string } & MediaInput<T>;

type BaseMediaProps<T> = BaseItemProps & MediaItemVariant<T> & {
  coverTag?: Snippet;
  indicators?: Snippet;
  mode?: 'standalone' | 'mixed';
  onclick?: (item: T) => void;
};

export type MediaCardProps<T = MediaInputDefault> =
  & BaseMediaProps<T>
  & (
    | { type: MediaType }
    | { variant: 'start'; type: 'show'; episode: EpisodeEntry }
  );
