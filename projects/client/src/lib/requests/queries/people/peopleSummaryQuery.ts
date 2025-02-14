import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { PersonSummarySchema } from '$lib/requests/models/PersonSummary.ts';
import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { time } from '$lib/utils/timing/time.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { PeopleSummaryResponse } from '@trakt/api';

type PersonSummaryParams = { slug: string } & ApiParams;

const peopleSummaryRequest = (
  { fetch, slug }: PersonSummaryParams,
) =>
  api({ fetch })
    .people
    .summary({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,images',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch person summary');
      }

      return response.body;
    });

const mapPeopleResponseToPersonSummary = (
  peopleSummaryResponse: PeopleSummaryResponse,
) => {
  const headshotCandidate = findDefined(
    ...(peopleSummaryResponse.images?.headshot ?? []),
  );

  return {
    slug: peopleSummaryResponse.ids.slug,
    name: peopleSummaryResponse.name,
    biography: peopleSummaryResponse.biography ?? '',
    knownFor: peopleSummaryResponse.known_for_department,
    headShotUrl: prependHttps(
      headshotCandidate,
      MEDIA_POSTER_PLACEHOLDER,
    ),
  };
};

export const peopleSummaryQuery = defineQuery({
  key: 'peopleSummary',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: peopleSummaryRequest,
  mapper: mapPeopleResponseToPersonSummary,
  schema: PersonSummarySchema,
  ttl: time.days(30),
});
