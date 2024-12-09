import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapShowResponseToShowSummary } from './_internal/mapShowResponseToShowSummary.ts';

type ShowSummaryParams = { slug: string } & ApiParams;

function showSummaryRequest(
  { fetch, slug }: ShowSummaryParams,
): Promise<ShowSummary> {
  return api({ fetch })
    .shows
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
        throw new Error('Failed to fetch up next');
      }

      return mapShowResponseToShowSummary(body);
    });
}

export const showSummaryQueryKey = (id: string) => ['showSummary', id] as const;
export const showSummaryQuery = (
  params: ShowSummaryParams,
) => ({
  queryKey: showSummaryQueryKey(params.slug),
  queryFn: () => showSummaryRequest(params),
});
