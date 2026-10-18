import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToUpcomingEpisodeEntry } from '$lib/requests/_internal/mapToUpcomingEpisodeEntry.ts';
import type {
  CalendarMovieResponse,
  CalendarShowResponse,
  HotReleaseResponse,
} from '@trakt/api';

function isCalendarMovie(
  entry: HotReleaseResponse,
): entry is CalendarMovieResponse {
  return 'movie' in entry;
}

function isCalendarShow(
  entry: HotReleaseResponse,
): entry is CalendarShowResponse {
  return 'episode' in entry;
}

export function mapToCalendarMedia(entries: HotReleaseResponse[]) {
  const episodes = entries
    .filter(isCalendarShow)
    .map(mapToUpcomingEpisodeEntry);

  const movies = entries
    .filter(isCalendarMovie)
    .map((entry) => mapToMovieEntry(entry.movie));

  return [...episodes, ...movies].toSorted(
    (a, b) =>
      a.effectiveReleaseDate.getTime() - b.effectiveReleaseDate.getTime(),
  );
}
