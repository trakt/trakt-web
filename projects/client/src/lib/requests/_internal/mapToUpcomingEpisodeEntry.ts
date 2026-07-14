import type { UpcomingEpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
import type { CalendarShowResponse } from '@trakt/api';
import { mapToEpisodeEntry } from './mapToEpisodeEntry.ts';
import { mapToShowEntry } from './mapToShowEntry.ts';

export function mapToUpcomingEpisodeEntry(
  item: CalendarShowResponse,
): UpcomingEpisodeEntry {
  return {
    show: mapToShowEntry(item.show),
    ...mapToEpisodeEntry(item.episode),
    // `group=day` collapses multi-episode days into one card; the server sends
    // the grouped episodes on `episode.episodes` (absent for single entries).
    ...(item.episode.episodes
      ? { episodes: item.episode.episodes.map(mapToEpisodeEntry) }
      : {}),
  };
}
