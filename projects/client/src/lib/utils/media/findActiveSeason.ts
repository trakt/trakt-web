import type { Season } from '$lib/requests/models/Season.ts';
import { EMPTY_SEASON_INFO } from '$lib/sections/lists/stores/useUserSeason.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';

const FIRST_SEASON = 1;
const SPECIAL_SEASON = 0;

type FindActiveSeasonProps = {
  seasons: Season[];
  lastWatchedSeason: {
    number: number;
    episodes: {
      count: number;
    };
  };
};

export function findActiveSeason({
  seasons,
  lastWatchedSeason,
}: FindActiveSeasonProps) {
  if (lastWatchedSeason === EMPTY_SEASON_INFO) {
    return FIRST_SEASON;
  }

  const lastWatched = seasons.find((s) =>
    s.number === lastWatchedSeason.number
  );
  const firstSeason = seasons.find((s) => s.number === FIRST_SEASON);
  const firstNonSpecialSeason = seasons.find((s) =>
    s.number !== SPECIAL_SEASON
  );

  const active = assertDefined(
    lastWatched ?? firstSeason ?? firstNonSpecialSeason,
    'Active season not found',
  );

  const isCurrentSeasonFullyWatched =
    active.episodes.count === lastWatchedSeason.episodes.count &&
    active.number === lastWatchedSeason.number;

  const maxSeason = assertDefined(
    seasons.at(-1),
    'Could not find last season',
  ).number;
  const nextSeason = Math.min(active.number + 1, maxSeason);

  const activeSeason = isCurrentSeasonFullyWatched ? nextSeason : active.number;

  return activeSeason;
}
