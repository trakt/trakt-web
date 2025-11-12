import type { PersonResponse } from '@trakt/api';
import type { PersonSummary } from '../models/PersonSummary.ts';
import { mapToHeadshot } from './mapToHeadshot.ts';

function mapToSocialMedia(response: PersonResponse) {
  if (!response.social_ids) {
    return;
  }

  return {
    x: response.social_ids.twitter,
    instagram: response.social_ids.instagram,
    facebook: response.social_ids.facebook,
  };
}

export const mapToPersonSummary = (
  response: PersonResponse,
): PersonSummary => {
  return {
    id: response.ids.trakt,
    key: `person-${response.ids.trakt}`,
    slug: response.ids.slug,
    imdb: response.ids.imdb,
    name: response.name,
    biography: response.biography ?? '',
    knownFor: response.known_for_department,
    headshot: mapToHeadshot(response.images),
    birthday: response.birthday ? new Date(response.birthday) : null,
    socialMedia: mapToSocialMedia(response),
  };
};
