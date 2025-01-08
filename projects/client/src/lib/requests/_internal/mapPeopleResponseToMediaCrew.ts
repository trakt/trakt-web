import type { CrewResponse, PeopleResponse } from '$lib/api.ts';
import type { CrewMember, MediaCrew } from '$lib/requests/models/MediaCrew.ts';

function toCrewMember(
  crewResponse: CrewResponse,
): CrewMember {
  return ({
    job: crewResponse.job,
    name: crewResponse.person.name,
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
  };
}
