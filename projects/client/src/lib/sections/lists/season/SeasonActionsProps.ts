import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { Season } from '$lib/requests/models/Season.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

export type SeasonActionsProps = {
  title: string;
  episodes: EpisodeEntry[];
  show: ShowEntry;
  season: Season;
  isLoading?: boolean;
};
