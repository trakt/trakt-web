import type { Season } from '$lib/requests/models/Season.ts';

export type SeasonDropdownProps = {
  showSlug: string;
  seasons: Season[];
  currentSeason: number;
  variant?: 'default' | 'detailed';
  urlBuilder?: (seasonNumber: number) => string;
};
