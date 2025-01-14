import type { PersonSummary } from '$lib/requests/models/PersonSummary.ts';
import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { PeopleSummaryResponse } from '@trakt/api';
import { api, type ApiParams } from '../../_internal/api.ts';

type PersonSummaryParams = { slug: string } & ApiParams;

function mapPeopleResponseToPersonSummary(
  peopleSummaryResponse: PeopleSummaryResponse,
): PersonSummary {
  const headshotCandidate = findDefined(
    peopleSummaryResponse.images?.headshot?.at(1),
    peopleSummaryResponse.images?.headshot?.at(0),
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
}

function peopleSummaryRequest(
  { fetch, slug }: PersonSummaryParams,
): Promise<PersonSummary> {
  return api({ fetch })
    .people
    .summary({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,cloud9',
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch person summary');
      }

      return mapPeopleResponseToPersonSummary(body);
    });
}

export const peopleSummaryQueryKey = (id: string) =>
  ['peopleSummary', id] as const;
export const peopleSummaryQuery = (
  params: PersonSummaryParams,
) => ({
  queryKey: peopleSummaryQueryKey(params.slug),
  queryFn: () => peopleSummaryRequest(params),
});
