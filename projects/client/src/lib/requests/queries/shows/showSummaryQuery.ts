import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';
import { time } from '$lib/utils/timing/time.ts';

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
        extended: 'full,images,colors',
      },
    });

export const showSummaryQuery = defineQuery({
  key: 'showSummary',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showSummaryRequest,
  mapper: (response) => mapToShowEntry(response.body),
  schema: MediaEntrySchema,
  ttl: time.days(1),
});
