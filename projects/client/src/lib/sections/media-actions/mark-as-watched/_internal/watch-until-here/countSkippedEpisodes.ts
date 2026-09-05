type SeasonRef = { number: number; episodes: { aired: number } };
type EpisodeRef = {
  number: number;
  effectiveReleaseDate: Date;
};

type CountSkippedEpisodesProps = {
  target: { season: number; number: number };
  currentSeasonEpisodes: ReadonlyArray<EpisodeRef>;
  previousSeasons: ReadonlyArray<SeasonRef>;
  watchedBySeason: ReadonlyMap<number, ReadonlySet<number>>;
  now?: Date;
};

/**
 * How many released episodes marking [target] as watched would leave behind.
 *
 * Counted from state the seasons row already holds, so a check that skips
 * nothing costs no request. Earlier seasons count by their aired totals rather
 * than by episode, since those lists are not loaded until the drawer asks for
 * them - which is also why specials, absent from [previousSeasons], never
 * count.
 */
export function countSkippedEpisodes({
  target,
  currentSeasonEpisodes,
  previousSeasons,
  watchedBySeason,
  now = new Date(),
}: CountSkippedEpisodesProps): number {
  const watchedHere = watchedBySeason.get(target.season) ?? new Set<number>();

  const inThisSeason =
    currentSeasonEpisodes.filter((candidate) =>
      candidate.number < target.number &&
      !watchedHere.has(candidate.number) &&
      candidate.effectiveReleaseDate <= now
    ).length;

  const inEarlierSeasons = previousSeasons
    .filter((season) => season.number < target.season)
    .reduce((total, season) => {
      const watched = watchedBySeason.get(season.number)?.size ?? 0;
      return total + Math.max(season.episodes.aired - watched, 0);
    }, 0);

  return inThisSeason + inEarlierSeasons;
}
