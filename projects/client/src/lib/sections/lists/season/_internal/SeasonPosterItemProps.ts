import type { Season } from '$lib/requests/models/Season.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

export type SeasonPosterItemProps = {
  show: ShowEntry;
  season: Season;
  isCurrentSeason: boolean;
  urlBuilder: () => string;
};
