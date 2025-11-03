import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import { EpisodeComputedType } from '$lib/requests/models/EpisodeType.ts';
import { episodeNumberLabel } from './episodeNumberLabel.ts';
import { multiEpisodeLabel } from './multiEpisodeLabel.ts';
import { seasonLabel } from './seasonLabel.ts';

type Show = {
  title: string;
};

// FIXME: refactor this away when changing month to date
export function episodeActivityTitle(
  episode: EpisodeEntry,
  show?: Show,
) {
  switch (episode.type) {
    case EpisodeComputedType.full_season:
      return seasonLabel(episode.season, show?.title);
    case EpisodeComputedType.multiple_episodes:
      return multiEpisodeLabel(
        episode.episodes ?? [],
        episode.season,
        show?.title,
      );
    default:
      return `${
        episodeNumberLabel({
          seasonNumber: episode.season,
          episodeNumber: episode.number,
        })
      } - ${show?.title ?? episode.title}`;
  }
}
