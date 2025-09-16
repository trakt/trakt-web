import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import { EpisodeComputedType } from '$lib/requests/models/EpisodeType.ts';
import { episodeNumberLabel } from './episodeNumberLabel.ts';
import { multiEpisodeLabel } from './multiEpisodeLabel.ts';
import { seasonLabel } from './seasonLabel.ts';

export function episodeSubtitle(episode: EpisodeEntry) {
  switch (episode.type) {
    case EpisodeComputedType.full_season:
      return seasonLabel(episode.season);
    case EpisodeComputedType.multiple_episodes:
      return multiEpisodeLabel(
        episode.episodes ?? [],
        episode.season,
      );
    default:
      return episodeNumberLabel({
        seasonNumber: episode.season,
        episodeNumber: episode.number,
      });
  }
}
