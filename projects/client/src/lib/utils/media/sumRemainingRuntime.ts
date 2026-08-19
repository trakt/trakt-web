import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';

type SumRemainingRuntimeProps = {
  episodes: ReadonlyArray<Pick<EpisodeEntry, 'number' | 'runtime'>>;
  airedCount: number;
  watchedEpisodeNumbers: ReadonlySet<number>;
};

export function sumRemainingRuntime({
  episodes,
  airedCount,
  watchedEpisodeNumbers,
}: SumRemainingRuntimeProps): number {
  return [...episodes]
    .sort((a, b) => a.number - b.number)
    .slice(0, Math.max(0, airedCount))
    .filter((episode) => !watchedEpisodeNumbers.has(episode.number))
    .reduce((total, episode) => total + (episode.runtime || 0), 0);
}
