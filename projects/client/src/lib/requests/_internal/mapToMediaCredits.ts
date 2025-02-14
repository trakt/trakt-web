import type {
  MovieResponse,
  PeopleMovieCreditsResponse,
  PeopleShowCreditsResponse,
  ShowResponse,
} from '$lib/api.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import type { CrewPosition } from '$lib/requests/models/CrewPosition.ts';
import type { MediaCredits } from '$lib/requests/models/MediaCredits.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';

type MediaCreditsResponse =
  | PeopleMovieCreditsResponse
  | PeopleShowCreditsResponse;

type EntryResponse = {
  movie: MovieResponse;
} | {
  show: ShowResponse;
};

function mapToMediaEntry(entryResponse: EntryResponse) {
  if ('movie' in entryResponse) {
    return mapToMovieEntry(entryResponse.movie);
  }

  return mapToShowEntry(entryResponse.show);
}

function mapToCrew(response: MediaCreditsResponse) {
  const crewResponse = Object.entries<EntryResponse[]>(response.crew ?? {});

  return crewResponse
    .reduce((map, [position, entries]) => {
      const mediaEntry = entries.map(mapToMediaEntry);
      map.set(position as CrewPosition, mediaEntry);
      return map;
    }, new Map<CrewPosition, MediaEntry[]>());
}

export function mapToMediaCredits(
  response: MediaCreditsResponse,
): MediaCredits {
  const castResponse = response.cast ?? [];

  return {
    cast: castResponse.map(mapToMediaEntry),
    crew: mapToCrew(response),
  };
}
