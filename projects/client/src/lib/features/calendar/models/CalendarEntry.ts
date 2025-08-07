import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { UpcomingEpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';

export type CalendarItem = UpcomingEpisodeEntry | MediaEntry;

export type CalendarEntry = {
  date: Date;
  items: Array<CalendarItem>;
};
