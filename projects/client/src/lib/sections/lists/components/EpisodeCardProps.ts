import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { EpisodeProgressEntry } from '$lib/requests/models/EpisodeProgressEntry.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

export type EpisodeItemVariant =
  | { type: 'next'; episode: EpisodeProgressEntry }
  | { type: 'upcoming'; episode: EpisodeEntry }
  | { type: 'default'; episode: EpisodeEntry; context?: 'show' | 'standalone' };

export type EpisodeCardProps = EpisodeItemVariant & {
  show: ShowEntry | MediaEntry;
  style?: 'cover' | 'summary';
};
