import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

export type SeasonPopupMenuProps = {
  title: string;
  episodes: EpisodeEntry[];
  show: ShowEntry;
  seasonId?: number;
  disabled?: boolean;
};
