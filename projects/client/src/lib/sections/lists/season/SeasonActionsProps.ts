import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

export type SeasonActionsProps = {
  title: string;
  episodes: EpisodeEntry[];
  show: ShowEntry;
  seasonId?: number;
  isLoading?: boolean;
};
