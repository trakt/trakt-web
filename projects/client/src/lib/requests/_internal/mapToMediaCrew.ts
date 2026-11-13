import type {
  CastMember,
  CrewMember,
  MediaCrew,
} from '$lib/requests/models/MediaCrew.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { CastResponse, CrewResponse, PeopleResponse } from '@trakt/api';
import { mapToHeadshot } from './mapToHeadshot.ts';
import { mediumUrl } from './mediumUrl.ts';
import { thumbUrl } from './thumbUrl.ts';

type CastResponseWithCharacterImage = CastResponse & {
  character_image?: string | null;
};

type PeopleResponseWithGuestStars = Omit<PeopleResponse, 'cast'> & {
  cast?: CastResponseWithCharacterImage[] | null;
  guest_stars?: CastResponseWithCharacterImage[] | null;
};

export const EMPTY_CREW: Readonly<MediaCrew> = {
  directors: [],
  writers: [],
  creators: [],
  cast: [],
  guestStars: [],
};

function toMember(response: CrewResponse | CastResponse) {
  return {
    name: response.person.name,
    key: response.person.ids.slug,
    ...(response.episode_count != null
      ? { episodeCount: response.episode_count }
      : {}),
  };
}

function toCrewMember(crewResponse: CrewResponse): CrewMember {
  return {
    ...toMember(crewResponse),
    jobs: crewResponse.jobs,
  };
}

function toCastHeadshot(castResponse: CastResponseWithCharacterImage) {
  const characterImage = castResponse.character_image?.trim();

  if (!characterImage) {
    return mapToHeadshot({
      id: castResponse.person.ids.trakt,
      images: castResponse.person.images,
    });
  }

  return {
    url: {
      medium: prependHttps(mediumUrl(characterImage) ?? characterImage),
      thumb: prependHttps(thumbUrl(characterImage) ?? characterImage),
    },
  };
}

function toCastMember(
  castResponse: CastResponseWithCharacterImage,
): CastMember {
  const characters = castResponse.characters ?? [];

  return {
    ...toMember(castResponse),
    characterName: castResponse.character ?? characters.at(0) ?? '',
    ...(characters.length > 1 ? { characters } : {}),
    headshot: toCastHeadshot(castResponse),
  };
}

export function mapToMediaCrew(
  response: PeopleResponseWithGuestStars,
): MediaCrew {
  return {
    directors: (response.crew?.directing ?? []).map(toCrewMember),
    writers: (response.crew?.writing ?? []).map(toCrewMember),
    creators: (response.crew?.['created by'] ?? []).map(toCrewMember),
    cast: (response.cast ?? []).map(toCastMember),
    guestStars: (response.guest_stars ?? []).map(toCastMember),
  };
}
