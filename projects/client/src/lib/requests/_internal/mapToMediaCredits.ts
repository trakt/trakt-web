import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import type { CrewPosition } from '$lib/requests/models/CrewPosition.ts';
import type { MediaCredits } from '$lib/requests/models/MediaCredits.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type {
  MovieResponse,
  PeopleMovieCreditsResponse,
  PeopleShowCreditsResponse,
  ShowResponse,
} from '@trakt/api';

type MediaCreditsResponse =
  | PeopleMovieCreditsResponse
  | PeopleShowCreditsResponse;

type EntryResponse = {
  movie: MovieResponse;
} | {
  show: ShowResponse;
};

const WELL_KNOWN_ROLES = [
  'self',
  'narrator',
] as const;

function mapToMediaEntry(entryResponse: EntryResponse) {
  if ('movie' in entryResponse) {
    return mapToMovieEntry(entryResponse.movie);
  }

  return mapToShowEntry(entryResponse.show);
}

export function mapToMediaCredits(
  response: MediaCreditsResponse,
): MediaCredits {
  const credits = new Map<CrewPosition, MediaEntry[]>();

  (response.cast ?? []).forEach((entry) => {
    const wellKnownRole = WELL_KNOWN_ROLES.find((role) =>
      entry.character.toLowerCase() === role
    );

    const key = wellKnownRole ?? 'acting';
    const entries = credits.get(key) ?? credits.set(key, []).get(key);
    entries?.push(mapToMediaEntry(entry));
  });

  const crewResponse = Object.entries<EntryResponse[]>(response.crew ?? {});
  crewResponse.forEach(([position, entries]) => {
    const mediaEntries = entries.map(mapToMediaEntry);
    const existingEntries = credits.get(position as CrewPosition);
    credits.set(
      position as CrewPosition,
      existingEntries ? [...existingEntries, ...mediaEntries] : mediaEntries,
    );
  });

  return credits;
}
