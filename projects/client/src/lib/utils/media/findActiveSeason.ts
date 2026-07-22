import type { Season } from '$lib/requests/models/Season.ts';
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
  const ordered = [...seasons].sort((a, b) => a.number - b.number);

  const fallbackSeason = ordered.find((s) => s.number === FIRST_SEASON) ??
    ordered.find((s) => s.number !== SPECIAL_SEASON) ??
    ordered.at(0);

  const hasWatchedHistory = lastWatchedSeason.number >= SPECIAL_SEASON &&
    lastWatchedSeason.episodes.count > 0;

  if (!hasWatchedHistory) {
    return fallbackSeason?.number ?? FIRST_SEASON;
  }

  const lastWatched = ordered.find((s) =>
    s.number === lastWatchedSeason.number
  );

  const active = assertDefined(
    lastWatched ?? fallbackSeason,
    'Active season not found',
  );

  const isCurrentSeasonFullyWatched =
    active.episodes.count === lastWatchedSeason.episodes.count &&
    active.number === lastWatchedSeason.number;

  const maxSeason = assertDefined(
    ordered.at(-1),
    'Could not find last season',
  ).number;
  const nextSeason = Math.min(active.number + 1, maxSeason);

  const activeSeason = isCurrentSeasonFullyWatched ? nextSeason : active.number;

  return activeSeason;
}
