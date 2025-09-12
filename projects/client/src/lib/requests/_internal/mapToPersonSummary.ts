import type { PeopleSummaryResponse } from '@trakt/api';
import type { PersonSummary } from '../models/PersonSummary.ts';
import { mapToHeadshot } from './mapToHeadshot.ts';

export const mapToPersonSummary = (
  response: PeopleSummaryResponse,
): PersonSummary => {
  return {
    id: response.ids.trakt,
    slug: response.ids.slug,
    name: response.name,
    biography: response.biography ?? '',
    knownFor: response.known_for_department,
    headshot: mapToHeadshot(response.images),
    birthday: response.birthday ? new Date(response.birthday) : null,
  };
};
