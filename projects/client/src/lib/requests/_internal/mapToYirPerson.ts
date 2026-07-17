import type { PersonResponse } from '@trakt/api';
import type { YirPerson, YirPersonTitle } from '../models/YirPerson.ts';
import { mapToHeadshot } from './mapToHeadshot.ts';

type RawYirPersonTitle = {
  title: string;
  type: 'show' | 'movie';
  trakt_id: number;
  episode_count?: number;
  year?: number | null;
};

type RawYirPerson = {
  person: PersonResponse;
  count: {
    movies: number;
    shows: number;
  };
  titles: RawYirPersonTitle[];
};

function mapTitle(raw: RawYirPersonTitle): YirPersonTitle {
  return {
    // A trakt id is only unique within a media type, so a movie and a show can
    // share the same numeric id. Key on `type` + id to keep them distinct.
    key: `${raw.type}-${raw.trakt_id}`,
    title: raw.title,
    type: raw.type,
    traktId: raw.trakt_id,
    episodeCount: raw.episode_count,
    year: raw.year,
  };
}

// Titles are keyed by `key` everywhere they render, so drop any duplicate that
// would collide on that composite key and crash the keyed `{#each}`.
function dedupeTitles(titles: RawYirPersonTitle[]): YirPersonTitle[] {
  const seen = new Set<string>();

  return titles.map(mapTitle).filter((title) => {
    if (seen.has(title.key)) return false;

    seen.add(title.key);
    return true;
  });
}

function mapPerson(raw: RawYirPerson): YirPerson {
  return {
    id: raw.person.ids.trakt,
    name: raw.person.name,
    slug: raw.person.ids.slug,
    headshot: mapToHeadshot(raw.person.images),
    count: raw.count,
    titles: dedupeTitles(raw.titles),
  };
}

export function mapToYirPeople(
  response: RawYirPerson[],
): YirPerson[] {
  return response.map(mapPerson);
}
