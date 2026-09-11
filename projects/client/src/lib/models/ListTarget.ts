import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { Season } from '$lib/requests/models/Season.ts';

export type ListTarget =
  | { type: MediaType; media: MediaEntry }
  | { type: 'season'; media: Season }
  | { type: 'episode'; media: EpisodeEntry };
