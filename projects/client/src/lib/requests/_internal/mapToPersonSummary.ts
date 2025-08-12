import type { PeopleSummaryResponse } from '@trakt/api';
import { mapToHeadshot } from './mapToHeadshot.ts';

export const mapToPersonSummary = (
  response: PeopleSummaryResponse,
) => {
  return {
    id: response.ids.trakt,
    slug: response.ids.slug,
    name: response.name,
    biography: response.biography ?? '',
    knownFor: response.known_for_department,
    headshot: mapToHeadshot(response.images),
  };
};
