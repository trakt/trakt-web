import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapShowResponseToShowSummary } from '$lib/requests/_internal/mapShowResponseToShowSummary.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';

type ShowSummaryParams = { slug: string } & ApiParams;

const showSummaryRequest = (
  { fetch, slug }: ShowSummaryParams,
) =>
  api({ fetch })
    .shows
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
        throw new Error('Failed to fetch show summary');
      }

      return response.body;
    });

export const showSummaryQuery = defineQuery({
  key: 'showSummary',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showSummaryRequest,
  mapper: mapShowResponseToShowSummary,
  schema: MediaEntrySchema,
});
