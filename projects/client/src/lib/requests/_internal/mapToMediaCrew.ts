import type {
  CastMember,
  CrewMember,
  MediaCrew,
} from '$lib/requests/models/MediaCrew.ts';
import type { PortraitOf } from '$lib/requests/models/PortraitOf.ts';
import { toMediaImageUrl } from '$lib/utils/url/toMediaImageUrl.ts';
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

function toPortrait(
  { media, id, season, token }: PortraitOf,
  personId: number,
): CastMember['headshot'] {
  const toUrl = (size: 'thumb' | 'medium') =>
    `${toMediaImageUrl({
      type: 'portraits',
      id:
        season != null
          ? `show-${id}-s${season}-${personId}`
          : `${media}-${id}-${personId}`,
      slot: 'portrait',
      size,
    })}?verify=${token}` as HttpsUrl;

  return { url: { medium: toUrl('medium'), thumb: toUrl('thumb') } };
}

function toCastHeadshot(
  castResponse: CastResponse,
  portraitOf: PortraitOf | Nil,
): CastMember['headshot'] {
  const personId = castResponse.person.ids.trakt;

  if (portraitOf) {
    return toPortrait(portraitOf, personId);
  }

  return mapToHeadshot({ id: personId, images: castResponse.person.images });
}

function toCastMember(portraitOf: PortraitOf | Nil) {
  return (castResponse: CastResponse): CastMember => {
    const characters = castResponse.characters ?? [];

    return {
      ...toMember(castResponse),
      characterName: castResponse.character ?? characters.at(0) ?? '',
      ...(characters.length > 1 ? { characters } : {}),
      headshot: toCastHeadshot(castResponse, portraitOf),
    };
  };
}

export function mapToMediaCrew(
  response: PeopleResponseWithGuestStars,
  portraitOf?: PortraitOf | Nil,
): MediaCrew {
  const toCast = toCastMember(portraitOf);

  return {
    directors: (response.crew?.directing ?? []).map(toCrewMember),
    writers: (response.crew?.writing ?? []).map(toCrewMember),
    creators: (response.crew?.['created by'] ?? []).map(toCrewMember),
    cast: (response.cast ?? []).map(toCast),
    guestStars: (response.guest_stars ?? []).map(toCast),
  };
}
