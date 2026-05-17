type EpisodeRef = { season: number; number: number } | null | undefined;

export function isLatestAiredEpisode(
  episode: EpisodeRef,
  latest: EpisodeRef,
): boolean {
  if (!episode) return false;
  if (!latest) return true;

  if (episode.season > latest.season) return true;
  if (episode.season < latest.season) return false;

  return episode.number >= latest.number;
}
