import * as m from '$lib/features/i18n/messages.ts';
import type { CrewPositions } from '$lib/requests/models/CrewPosition.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';

type MainCredit = {
  text: string;
  key: string;
  positions?: CrewPositions;
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
  const director = crew.directors?.find((person) =>
    person.jobs.some((job) => job.toLowerCase() === 'director')
  );
  if (!director) return null;

  const positions = type === 'movie'
    ? { movies: 'directing' as const }
    : { shows: 'directing' as const };

  return {
    text: m.text_directed_by({ name: director.name }),
    key: director.key,
    positions,
  };
}

export function mapToMainCredit(
  type: ExtendedMediaType,
  crew: MediaCrew,
): MainCredit | null {
  return type === 'show' ? mapToCreator(crew) : mapToDirector(type, crew);
}
