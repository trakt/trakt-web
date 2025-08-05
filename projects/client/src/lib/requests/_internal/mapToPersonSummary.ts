import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { PeopleSummaryResponse } from '@trakt/api';

export const mapToPersonSummary = (
  response: PeopleSummaryResponse,
) => {
  const headshotCandidate = findDefined(
    ...(response.images?.headshot ?? []),
  );

  return {
    id: response.ids.trakt,
    slug: response.ids.slug,
    name: response.name,
    biography: response.biography ?? '',
    knownFor: response.known_for_department,
    headShotUrl: prependHttps(
      headshotCandidate,
      MEDIA_POSTER_PLACEHOLDER,
    ),
  };
};
