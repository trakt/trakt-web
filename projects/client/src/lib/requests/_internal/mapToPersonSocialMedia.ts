import type { PersonResponse } from '@trakt/api';
import type { PersonSocialMedia } from '../models/PersonSocialMedia.ts';
import { mapToSocialMedia } from './mapToSocialMedia.ts';

export function mapToPersonSocialMedia(
  response: PersonResponse,
): PersonSocialMedia | undefined {
  const socialMedia = mapToSocialMedia(response);
  const socialIds = response.social_ids;

  if (!socialMedia || !socialIds) {
    return;
  }

  return {
    ...socialMedia,
    tiktok: socialIds.tiktok ?? null,
    youtube: socialIds.youtube ?? null,
    wikidata: socialIds.wikidata ?? null,
    wikipediaLanguage: socialIds.wikipedia_language ?? null,
  };
}
