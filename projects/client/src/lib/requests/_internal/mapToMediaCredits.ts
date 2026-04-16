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
import type { MediaEntry } from '../models/MediaEntry.ts';

type MediaCreditsResponse =
  | PeopleMovieCreditsResponse
  | PeopleShowCreditsResponse;

type EntryResponse = {
  movie: MovieResponse;
} | {
  show: ShowResponse;
};

const WELL_KNOWN_ROLES: Partial<
  Record<CrewPosition, (value: string) => boolean>
> = {
  self: (value: string) => {
    const patterns = ['self (', 'self -'];
    return patterns.some((p) => value.startsWith(p));
  },
  narrator: (value: string) => {
    const patterns = ['narrator ('];
    return patterns.some((p) => value.startsWith(p));
  },
  unknown: (value: string) => {
    return value.trim() === '';
  },
};

function mapToMediaEntry(entryResponse: EntryResponse) {
  if ('movie' in entryResponse) {
    return mapToMovieEntry(entryResponse.movie);
  }

  return mapToShowEntry(entryResponse.show);
}

type CrewResponse = NonNullable<MediaCreditsResponse['crew']>;
type CrewEntry = CrewResponse[string][number];

type CastResponse = NonNullable<MediaCreditsResponse['cast']>;
type CastEntry = CastResponse[number];

function toCredit(media: MediaEntry, entry: CrewEntry | CastEntry) {
  return {
    media,
    key: media.key,
    ...('episode_count' in entry && entry.episode_count != null
      ? { episodeCount: entry.episode_count }
      : {}),
  };
}

export function mapToMediaCredits(
  response: MediaCreditsResponse,
): MediaCredits {
  const credits = new Map<CrewPosition, MediaCredit[]>();

  (response.cast ?? []).forEach((entry) => {
    const character = entry.character.toLowerCase();

    const wellKnownRole = Object.entries(WELL_KNOWN_ROLES)
      .find(([role, isMatch]) => character === role || isMatch(character))
      ?.[0] as CrewPosition | undefined;

    const key = wellKnownRole ?? 'acting';
    const entries = credits.get(key) ?? credits.set(key, []).get(key);
    const media = mapToMediaEntry(entry);

    entries?.push({
      ...toCredit(media, entry),
      type: 'cast',
      character: entry.character,
    });
  });

  const crewResponse = Object.entries(response.crew ?? {});
  crewResponse.forEach(([position, entries]) => {
    const mediaEntries = entries.map((entry: CrewEntry) => {
      const media = mapToMediaEntry(entry);
      return {
        ...toCredit(media, entry),
        type: 'crew',
        job: entry.job,
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
