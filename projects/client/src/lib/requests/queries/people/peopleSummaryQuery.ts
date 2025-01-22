import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { PersonSummarySchema } from '$lib/requests/models/PersonSummary.ts';
import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { PeopleSummaryResponse } from '@trakt/api';
import { api, type ApiParams } from '../../_internal/api.ts';

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
        extended: 'full,cloud9',
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
    headShotUrl: prependHttps(
      headshotCandidate,
      MEDIA_POSTER_PLACEHOLDER,
    ),
  };
};

export const peopleSummaryQuery = await defineQuery({
  key: 'peopleSummary',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: peopleSummaryRequest,
  mapper: mapPeopleResponseToPersonSummary,
  schema: PersonSummarySchema,
});
