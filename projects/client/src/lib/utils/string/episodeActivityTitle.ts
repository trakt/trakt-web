import type { EpisodeEntry } from '../../requests/models/EpisodeEntry.ts';
import type { ShowEntry } from '../../requests/models/ShowEntry.ts';

export function episodeActivityTitle(
  episode: EpisodeEntry,
  show: ShowEntry,
) {
  return `${episode.season}x${episode.number} - ${show.title}`;
}
