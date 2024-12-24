import type { CrewResponse, PeopleResponse } from '$lib/api.ts';
import type { CrewMember, MediaCrew } from '$lib/requests/models/MediaCrew.ts';

function mapCrewPosition(
  crewResponse: CrewResponse[] = [],
): CrewMember[] {
  return crewResponse.map((crewMember) => ({
    job: crewMember.job,
    name: crewMember.person.name,
  }));
}

export function mapPeopleResponseToMediaCrew(
  response: PeopleResponse,
): MediaCrew {
  return {
    directors: mapCrewPosition(response.crew.directing ?? []),
    writers: mapCrewPosition(response.crew.writing ?? []),
  };
}
