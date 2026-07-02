import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import type {
  CastMember,
  CrewMember,
  MediaCrew,
} from '$lib/requests/models/MediaCrew.ts';
import type { CreditMember } from '$lib/sections/lists/models/CreditMember.ts';
import { toTranslatedJob } from '$lib/utils/formatting/string/toTranslatedJob.ts';

type ToCreditMembersProps = {
  crew: MediaCrew;
  type: ExtendedMediaType;
};

type CreditMembers = {
  cast: CreditMember[];
  crew: CreditMember[];
};

const toCastDescriptionItems = (castMember: CastMember) =>
  (castMember.characters ?? [castMember.characterName])
    .filter(Boolean)
    .map((character) => character.trim())
    .filter(Boolean);

const mergeCrewMembers = (
  currentMember: CrewMember,
  nextMember: CrewMember,
): CrewMember => {
  const episodeCounts = [
    currentMember.episodeCount,
    nextMember.episodeCount,
  ].filter((count): count is number => count != null);
  const episodeCount = episodeCounts.length > 0
    ? Math.max(...episodeCounts)
    : undefined;

  return {
    ...currentMember,
    ...(episodeCount != null ? { episodeCount } : {}),
    jobs: [...new Set([...currentMember.jobs, ...nextMember.jobs])],
  };
};

const uniqueCrewMembers = (members: CrewMember[]): CrewMember[] => {
  const membersByKey = members.reduce((map, member) => {
    const currentMember = map.get(member.key);
    return map.set(
      member.key,
      currentMember ? mergeCrewMembers(currentMember, member) : member,
    );
  }, new Map<string, CrewMember>());

  return [...membersByKey.values()];
};

const toCrewCreditMember = (crewMember: CrewMember): CreditMember => ({
  description: crewMember.jobs.map((job) => toTranslatedJob(job)).join(', '),
  episodeCount: crewMember.episodeCount,
  key: crewMember.key,
  name: crewMember.name,
});

export function toCreditMembers(
  { crew, type }: ToCreditMembersProps,
): CreditMembers {
  const castPositions = type === 'movie'
    ? { movies: 'acting' as const }
    : { shows: 'acting' as const };

  const toCastCreditMember = (castMember: CastMember): CreditMember => {
    const descriptionItems = toCastDescriptionItems(castMember);

    return {
      description: descriptionItems.join(', '),
      descriptionItems,
      episodeCount: castMember.episodeCount,
      headshot: castMember.headshot,
      key: castMember.key,
      name: castMember.name,
      positions: castPositions,
    };
  };

  return {
    cast: crew.cast.map(toCastCreditMember),
    crew: uniqueCrewMembers([
      ...crew.creators,
      ...crew.directors,
      ...crew.writers,
    ]).map(toCrewCreditMember),
  };
}
