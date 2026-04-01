import type { PersonResponse } from '@trakt/api';
import type { YirPerson } from '../models/YirPerson.ts';
import { mapToHeadshot } from './mapToHeadshot.ts';

type RawYirPersonTitle = {
  title: string;
  type: 'show' | 'movie';
  trakt_id: number;
  episode_count?: number;
};

type RawYirPerson = {
  person: PersonResponse;
  count: {
    movies: number;
    shows: number;
  };
  titles: RawYirPersonTitle[];
};

function mapPerson(raw: RawYirPerson): YirPerson {
  return {
    id: raw.person.ids.trakt,
    name: raw.person.name,
    slug: raw.person.ids.slug,
    headshot: mapToHeadshot(raw.person.images),
    count: raw.count,
    titles: raw.titles.map((t) => ({
      title: t.title,
      type: t.type,
      traktId: t.trakt_id,
      episodeCount: t.episode_count,
    })),
  };
}

export function mapToYirPeople(
  response: RawYirPerson[],
): YirPerson[] {
  return response.map(mapPerson);
}
