type SeasonProgressSnapshot = {
  seasonNumber: number;
  watched: number;
  total: number;
  loading: boolean;
};

const isComplete = ({ watched, total }: SeasonProgressSnapshot) =>
  total > 0 && watched >= total;

export function didCompleteSeason(
  previous: SeasonProgressSnapshot | null,
  next: SeasonProgressSnapshot,
): boolean {
  if (!previous || previous.loading || next.loading) return false;
  if (previous.seasonNumber !== next.seasonNumber) return false;

  return !isComplete(previous) && isComplete(next);
}
