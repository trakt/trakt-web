import type { PersonResponse } from '@trakt/api';
import { crewPositionSchema } from '../models/CrewPosition.ts';
import type { PersonSummary } from '../models/PersonSummary.ts';
import { SEO_ORIGIN } from '$lib/features/seo/seoOrigin.ts';
import { parseLocalDate } from '$lib/utils/date/parseLocalDate.ts';
import { toRelativeMarkdownLinks } from '$lib/utils/markdown/toRelativeMarkdownLinks.ts';
import { mapToHeadshot } from './mapToHeadshot.ts';
import { mapToSocialMedia } from './mapToSocialMedia.ts';

export const mapToPersonSummary = (
  response: PersonResponse,
): PersonSummary => {
  return {
    id: response.ids.trakt,
    key: `person-${response.ids.trakt}`,
    slug: response.ids.slug,
    imdb: response.ids.imdb,
    name: response.name,
    biography: toRelativeMarkdownLinks(response.biography ?? '', SEO_ORIGIN),
    knownFor:
      crewPositionSchema.safeParse(response.known_for_department).data ?? null,
    headshot: mapToHeadshot(response.images),
    /**
     * FIXME: @seferturan remove cast once @trakt/api is updated
     */
    height: (response as unknown as { height: number }).height,
    birthday: response.birthday ? parseLocalDate(response.birthday) : null,
    socialMedia: mapToSocialMedia(response),
    deathDate: response.death ? parseLocalDate(response.death) : null,
  };
};
