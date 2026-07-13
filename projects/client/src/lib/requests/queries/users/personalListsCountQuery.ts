import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractItemCount } from '$lib/requests/_internal/extractItemCount.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { CountResultSchema } from '$lib/requests/models/CountResult.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';

type PersonalListsCountParams = {
  slug: string;
} & ApiParams;

const personalListsCountRequest = (
  { fetch, slug }: PersonalListsCountParams,
) =>
  api({ fetch })
    .users
    .lists
    .personal({
      params: {
        id: slug,
      },
      query: {
        page: 1,
        limit: 1,
      },
    });

export const personalListsCountQuery = defineQuery({
  key: 'personalListsCount',
  invalidations: [
    InvalidateAction.List.Created,
    InvalidateAction.List.Deleted,
  ],
  dependencies: (params) => [params.slug],
  request: personalListsCountRequest,
  mapper: (response) => ({ count: extractItemCount(response.headers) }),
  schema: CountResultSchema,
  ttl: time.minutes(30),
});
