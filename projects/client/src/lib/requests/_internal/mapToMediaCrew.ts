import type {
  CastMember,
  CrewMember,
  MediaCrew,
} from '$lib/requests/models/MediaCrew.ts';
import type { CastResponse, CrewResponse, PeopleResponse } from '@trakt/api';
import { mapToHeadshot } from './mapToHeadshot.ts';

type PeopleResponseWithGuestStars = PeopleResponse & {
  guest_stars?: CastResponse[] | null;
};

export const EMPTY_CREW: Readonly<MediaCrew> = {
  directors: [],
  writers: [],
  creators: [],
  cast: [],
  guestStars: [],
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
  const characters = castResponse.characters ?? [];

  return ({
    ...toMember(castResponse),
    characterName: castResponse.character ?? characters.at(0) ?? '',
    ...(characters.length > 1 ? { characters } : {}),
    headshot: mapToHeadshot(castResponse.person.images),
  });
}

export function mapToMediaCrew(
  response: PeopleResponse,
): MediaCrew {
  const people = response as PeopleResponseWithGuestStars;

  return {
    directors: (people.crew?.directing ?? [])
      .map(toCrewMember),
    writers: (people.crew?.writing ?? [])
      .map(toCrewMember),
    creators: (people.crew?.['created by'] ?? [])
      .map(toCrewMember),
    cast: (people.cast ?? [])
      .map(toCastMember),
    guestStars: (people.guest_stars ?? [])
      .map(toCastMember),
  };
}
