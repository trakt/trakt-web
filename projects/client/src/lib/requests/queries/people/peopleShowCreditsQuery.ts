import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type PeopleShowCreditsParams = { slug: string } & ApiParams;

function peopleShowCreditsRequest(
  { fetch, slug }: PeopleShowCreditsParams,
): Promise<ShowSummary[]> {
  return api({ fetch })
    .people
    .shows({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,cloud9',
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch person show credits');
      }

      return (body.cast ?? [])
        .map(({ show }) => mapShowResponseToShowSummary(show));
    });
}

export const peopleShowCreditsQueryKey = (id: string) =>
  ['peopleShowCredits', id] as const;
export const peopleShowCreditsQuery = (
  params: PeopleShowCreditsParams,
) => ({
  queryKey: peopleShowCreditsQueryKey(params.slug),
  queryFn: () => peopleShowCreditsRequest(params),
});
