import * as m from '$lib/features/i18n/messages.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';

export function episodeMetaInfo(
  episode: EpisodeEntry,
  showTitle: string,
): string {
  return `${showTitle} • ${m.text_season_episode_number(episode)}`;
}
