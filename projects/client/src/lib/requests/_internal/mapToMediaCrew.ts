import type {
  CastMember,
  CrewMember,
  MediaCrew,
} from '$lib/requests/models/MediaCrew.ts';
import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { CastResponse, CrewResponse, PeopleResponse } from '@trakt/api';

function toCrewMember(
  crewResponse: CrewResponse,
): CrewMember {
  return ({
    jobs: crewResponse.jobs,
    name: crewResponse.person.name,
    id: crewResponse.person.ids.slug,
  });
}

function toCastMember(
  castResponse: CastResponse,
): CastMember {
  const headshotCandidate = findDefined(
    ...(castResponse.person.images?.headshot ?? []),
  );

  return ({
    name: castResponse.person.name,
    characterName: castResponse.characters.at(0) ?? '',
    id: castResponse.person.ids.slug,
    headShotUrl: prependHttps(
      headshotCandidate,
      MEDIA_POSTER_PLACEHOLDER,
    ),
  });
}

export function mapToMediaCrew(
  response: PeopleResponse,
): MediaCrew {
  return {
    directors: (response.crew?.directing ?? [])
      .map(toCrewMember),
    writers: (response.crew?.writing ?? [])
      .map(toCrewMember),
    creators: (response.crew?.['created by'] ?? [])
      .map(toCrewMember),
    cast: (response.cast ?? [])
      .map(toCastMember),
  };
}
