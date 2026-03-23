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

function mapToCreator(crew: MediaCrew): MainCredit | null {
  const creator = crew.creators?.at(0);
  if (!creator) return null;

  return {
    text: m.text_created_by({ name: creator.name }),
    key: creator.key,
    positions: { shows: 'created by' },
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
    others: rest.length > 0
      ? rest.map(({ name, key }) => ({ name, key }))
      : undefined,
  };
}

export function mapToMainCredit(
  type: ExtendedMediaType,
  crew: MediaCrew,
): MainCredit | null {
  return type === 'show' ? mapToCreator(crew) : mapToDirector(type, crew);
}
