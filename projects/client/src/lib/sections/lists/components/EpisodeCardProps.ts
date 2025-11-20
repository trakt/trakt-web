import type { ShowInput } from '$lib/models/MediaInput.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { EpisodeProgressEntry } from '$lib/requests/models/EpisodeProgressEntry.ts';
import type { Snippet } from 'svelte';

type EpisodeContext = 'show' | 'standalone';

export type EpisodeItemVariant =
  | {
    variant: 'next';
    episode: EpisodeProgressEntry;
    context?: EpisodeContext;
  }
  | {
    variant: 'default' | 'upcoming';
    episode: EpisodeEntry;
    context?: EpisodeContext;
  }
  | { variant: 'activity'; episode: EpisodeEntry; date: Date };

export type EpisodeCardProps = EpisodeItemVariant & {
  badge?: Snippet;
  action?: Snippet;
  tag?: Snippet;
  show: ShowInput;
  style?: 'cover' | 'summary';
  source?: string;
  popupActions?: Snippet;
  /**
   * FIXME: We should migrate these on the backend and remove from the client.
   */
  status?: 'watching' | 'hidden';
};
