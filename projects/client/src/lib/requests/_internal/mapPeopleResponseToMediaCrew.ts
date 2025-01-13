import type { CastResponse, CrewResponse, PeopleResponse } from '$lib/api.ts';
import type {
  CastMember,
  CrewMember,
  MediaCrew,
} from '$lib/requests/models/MediaCrew.ts';
import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/constants';
import { findDefined } from '$lib/utils/string/findDefined';
import { prependHttps } from '$lib/utils/url/prependHttps';

function toCrewMember(
  crewResponse: CrewResponse,
): CrewMember {
  return ({
    jobs: crewResponse.jobs,
    name: crewResponse.person.name,
  });
}

function toCastMember(
  castResponse: CastResponse,
): CastMember {
  const headshotCandidate = findDefined(
    castResponse.images?.headshot?.at(1),
    castResponse.images?.headshot?.at(0),
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

export function mapPeopleResponseToMediaCrew(
  response: PeopleResponse,
): MediaCrew {
  return {
    directors: (response.crew?.directing ?? [])
      .map(toCrewMember),
    writers: (response.crew?.writing ?? [])
      .map(toCrewMember),
    cast: (response.cast ?? [])
      .map(toCastMember),
  };
}
