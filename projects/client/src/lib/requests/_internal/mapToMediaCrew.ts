import type {
  CastMember,
  CrewMember,
  MediaCrew,
} from '$lib/requests/models/MediaCrew.ts';
import type { CastResponse, CrewResponse, PeopleResponse } from '@trakt/api';
import { mapToHeadshot } from './mapToHeadshot.ts';

function toCrewMember(
  crewResponse: CrewResponse,
): CrewMember {
  return ({
    jobs: crewResponse.jobs,
    name: crewResponse.person.name,
    key: crewResponse.person.ids.slug,
  });
}

function toCastMember(
  castResponse: CastResponse,
): CastMember {
  return ({
    name: castResponse.person.name,
    characterName: castResponse.characters.at(0) ?? '',
    key: castResponse.person.ids.slug,
    headshot: mapToHeadshot(castResponse.person.images),
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
