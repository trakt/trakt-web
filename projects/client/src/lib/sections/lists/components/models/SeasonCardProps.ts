import type { Season } from '$lib/requests/models/Season.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import type { BaseItemProps } from './BaseItemProps.ts';

export type SeasonCardProps = BaseItemProps & {
  season: Season;
  media: ShowEntry;
  variant?: 'default' | 'list-item';
};
