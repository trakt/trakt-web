import type { Season } from '$lib/requests/models/Season.ts';

type CaughtUpSeasonParams = {
  seasons: ReadonlyArray<Pick<Season, 'number' | 'episodes'>>;
  watchedPerSeason: ReadonlyMap<number, number>;
};

export function toCaughtUpSeason({
  seasons,
  watchedPerSeason,
}: CaughtUpSeasonParams): number {
  return seasons
    .filter(({ number }) => number > 0)
    .filter(({ episodes }) => episodes.aired > 0)
    .filter(
      ({ number, episodes }) =>
        (watchedPerSeason.get(number) ?? 0) >= episodes.aired,
    )
    .reduce((highest, { number }) => Math.max(highest, number), 0);
}
