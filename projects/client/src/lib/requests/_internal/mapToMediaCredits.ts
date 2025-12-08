import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import type { CrewPosition } from '$lib/requests/models/CrewPosition.ts';
import type {
  MediaCredit,
  MediaCredits,
} from '$lib/requests/models/MediaCredits.ts';
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

const WELL_KNOWN_ROLES: Record<string, string[]> = {
  self: ['self (', 'self -'],
  narrator: ['narrator ('],
};

function mapToMediaEntry(entryResponse: EntryResponse) {
  if ('movie' in entryResponse) {
    return mapToMovieEntry(entryResponse.movie);
  }

  return mapToShowEntry(entryResponse.show);
}

type CrewResponse = NonNullable<MediaCreditsResponse['crew']>;
type CrewEntry = CrewResponse[string][number];

export function mapToMediaCredits(
  response: MediaCreditsResponse,
): MediaCredits {
  const credits = new Map<CrewPosition, MediaCredit[]>();

  (response.cast ?? []).forEach((entry) => {
    const character = entry.character.toLowerCase();

    const wellKnownRole = Object.entries(WELL_KNOWN_ROLES)
      .find(([role, patterns]) =>
        character === role || patterns.some((p) => character.startsWith(p))
      )?.[0];

    const key = wellKnownRole ?? 'acting';
    const entries = credits.get(key) ?? credits.set(key, []).get(key);
    const media = mapToMediaEntry(entry);

    entries?.push({
      media,
      type: 'cast',
      character: entry.character,
      key: media.key,
    });
  });

  const crewResponse = Object.entries(response.crew ?? {});
  crewResponse.forEach(([position, entries]) => {
    const mediaEntries = entries.map((entry: CrewEntry) => {
      const media = mapToMediaEntry(entry);
      return {
        media,
        type: 'crew',
        job: entry.job,
        key: media.key,
      };
    });

    const existingEntries = credits.get(position as CrewPosition);
    credits.set(
      position as CrewPosition,
      existingEntries ? [...existingEntries, ...mediaEntries] : mediaEntries,
    );
  });

  return credits;
}
