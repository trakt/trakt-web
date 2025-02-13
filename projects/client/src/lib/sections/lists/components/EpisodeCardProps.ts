import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { EpisodeProgressEntry } from '$lib/requests/models/EpisodeProgressEntry.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import type { Snippet } from 'svelte';

export type EpisodeItemVariant =
  | { variant: 'next'; episode: EpisodeProgressEntry }
  | { variant: 'upcoming'; episode: EpisodeEntry }
  | {
    variant: 'default';
    episode: EpisodeEntry;
    context?: 'show' | 'standalone';
  }
  | { variant: 'activity'; episode: EpisodeEntry; date: Date };

export type EpisodeCardProps = EpisodeItemVariant & {
  badges?: Snippet;
  show: ShowEntry | MediaEntry;
  style?: 'cover' | 'summary';
};
