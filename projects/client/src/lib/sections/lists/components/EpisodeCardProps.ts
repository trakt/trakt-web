import type { MediaInputDefault } from '$lib/models/MediaInput.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { EpisodeProgressEntry } from '$lib/requests/models/EpisodeProgressEntry.ts';
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
  action?: Snippet;
  tags?: Snippet;
  show: MediaInputDefault;
  style?: 'cover' | 'summary';
  popupActions?: Snippet;
  /**
   * FIXME: We should migrate these on the backend and remove from the client.
   */
  status?: 'watching' | 'hidden';
};
