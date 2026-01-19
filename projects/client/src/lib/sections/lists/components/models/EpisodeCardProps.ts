import type { ShowInput } from '$lib/models/MediaInput.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { EpisodeProgressEntry } from '$lib/requests/models/EpisodeProgressEntry.ts';
import type { BaseItemProps } from './BaseItemProps.ts';

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
  | { variant: 'activity'; episode: EpisodeEntry; date: Date }
  | { variant: 'list-item'; episode: EpisodeEntry };

export type EpisodeCardProps = BaseItemProps & EpisodeItemVariant & {
  media: ShowInput;
  /**
   * FIXME: We should migrate these on the backend and remove from the client.
   */
  status?: 'watching' | 'hidden';
};
