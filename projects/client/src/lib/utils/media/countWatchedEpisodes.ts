export function countWatchedEpisodes(
  playsPerSeason: ReadonlyMap<number, number>,
): number {
  return [...playsPerSeason.entries()]
    .filter(([season]) => season !== 0)
    .reduce((sum, [, count]) => sum + count, 0);
}
