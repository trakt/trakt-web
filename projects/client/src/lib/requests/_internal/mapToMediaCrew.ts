import type {
  CastMember,
  CrewMember,
  MediaCrew,
} from '$lib/requests/models/MediaCrew.ts';
import type { CastResponse, CrewResponse, PeopleResponse } from '@trakt/api';
import { mapToHeadshot } from './mapToHeadshot.ts';

export const EMPTY_CREW: Readonly<MediaCrew> = {
  directors: [],
  writers: [],
  creators: [],
  cast: [],
};

function toMember(response: CrewResponse | CastResponse) {
  return ({
    name: response.person.name,
    key: response.person.ids.slug,
    ...(response.episode_count != null
      ? { episodeCount: response.episode_count }
      : {}),
  });
}

function toCrewMember(
  crewResponse: CrewResponse,
): CrewMember {
  return ({
    ...toMember(crewResponse),
    jobs: crewResponse.jobs,
  });
}

function toCastMember(
  castResponse: CastResponse,
): CastMember {
  return ({
    ...toMember(castResponse),
    characterName: castResponse.characters.at(0) ?? '',
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
