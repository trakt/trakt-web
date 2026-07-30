import type { Season } from '$lib/requests/models/Season.ts';

export function hasSeasonTitles(seasons: ReadonlyArray<Season>): boolean {
  return seasons.some((season) => Boolean(season.title));
}
