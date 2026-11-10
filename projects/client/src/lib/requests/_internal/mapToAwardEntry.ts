import type {
  AwardCeremonyResponse,
  PersonAwardResponse,
  TitleAwardResponse,
} from '@trakt/api';
import {
  type AwardCeremonyKey,
  AwardCeremonyKeySchema,
} from '../models/AwardCeremonyKey.ts';
import type { AwardEntry } from '../models/AwardEntry.ts';
import { mapToHeadshot } from './mapToHeadshot.ts';
import { mapToPoster } from './mapToPoster.ts';

type AwardResponse = TitleAwardResponse | PersonAwardResponse;
type AwardMediaResponse = {
  title: string;
  year?: number | Nil;
  ids: { trakt: number; slug: string };
};

function toCeremonyKey(slug: string): AwardCeremonyKey {
  const parsed = AwardCeremonyKeySchema.safeParse(slug);
  return parsed.success ? parsed.data : 'other';
}

function toDate(value: string | null): Date | null {
  return value ? new Date(`${value}T00:00`) : null;
}

function mapToCeremony(
  ceremony: AwardCeremonyResponse,
): AwardEntry['ceremony'] {
  return {
    key: toCeremonyKey(ceremony.slug),
    slug: ceremony.slug,
    name: ceremony.name,
    edition: ceremony.edition,
    nominationsAt: toDate(ceremony.nominations_at),
    heldAt: toDate(ceremony.held_at),
  };
}

function mapToMedia(
  type: 'movie' | 'show',
  media: AwardMediaResponse,
): NonNullable<AwardEntry['media']> {
  return {
    type,
    id: media.ids.trakt,
    slug: media.ids.slug,
    title: media.title,
    year: media.year,
    poster: mapToPoster({
      type: type === 'movie' ? 'movies' : 'shows',
      id: media.ids.trakt,
      images: undefined,
    }),
  };
}

function toPerson(response: AwardResponse): AwardEntry['person'] {
  if (!('person' in response) || !response.person) return;

  return {
    id: response.person.ids.trakt,
    slug: response.person.ids.slug,
    name: response.person.name,
    headshot: mapToHeadshot({
      id: response.person.ids.trakt,
      images: undefined,
    }),
  };
}

function toMedia(response: AwardResponse): AwardEntry['media'] {
  if ('movie' in response) return mapToMedia('movie', response.movie);
  if ('show' in response) return mapToMedia('show', response.show);
}

export function mapToAwardEntry(response: AwardResponse): AwardEntry {
  const person = toPerson(response);
  const media = toMedia(response);
  const subjectId = person?.id ?? media?.id ?? '';

  return {
    key: `${response.ceremony.slug}-${response.award.slug}-${response.year}-${subjectId}`,
    category: response.award.name,
    ceremony: mapToCeremony(response.ceremony),
    year: response.year,
    won: response.won,
    ...(person ? { person } : {}),
    ...(media ? { media } : {}),
  };
}
