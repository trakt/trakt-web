import * as m from '$lib/features/i18n/messages.ts';
import type { CrewPositions } from '$lib/requests/models/CrewPosition.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';

type AdditionalPerson = {
  name: string;
  key: string;
};

type MainCredit = {
  text: string;
  key: string;
  positions?: CrewPositions;
  others?: ReadonlyArray<AdditionalPerson>;
};

function mapToOthers(
  others: Array<{ name: string; key: string }>,
): ReadonlyArray<AdditionalPerson> {
  return others.slice(0, 1).map(({ name, key }) => ({ name, key }));
}

function mapToCreator(crew: MediaCrew): MainCredit | null {
  const [first, ...rest] = crew.creators ?? [];
  if (!first) return null;

  return {
    text: m.text_created_by({ name: first.name }),
    key: first.key,
    positions: { shows: 'created by' },
    others: rest.length > 0 ? mapToOthers(rest) : undefined,
  };
}

function mapToDirector(
  type: 'movie' | 'episode',
  crew: MediaCrew,
): MainCredit | null {
  const directors = crew.directors?.filter((person) =>
    person.jobs.some((job) => job.toLowerCase() === 'director')
  );

  const [first, ...rest] = directors ?? [];
  if (!first) return null;

  const positions = type === 'movie'
    ? { movies: 'directing' as const }
    : { shows: 'directing' as const };

  return {
    text: m.text_directed_by({ name: first.name }),
    key: first.key,
    positions,
    others: rest.length > 0 ? mapToOthers(rest) : undefined,
  };
}

export function mapToMainCredit(
  type: ExtendedMediaType,
  crew: MediaCrew,
): MainCredit | null {
  return type === 'show' ? mapToCreator(crew) : mapToDirector(type, crew);
}
