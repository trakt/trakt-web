import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { extractItemCount } from '$lib/requests/_internal/extractItemCount.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { CountResultSchema } from '$lib/requests/models/CountResult.ts';
import { time } from '$lib/utils/timing/time.ts';

type ProgressCountParams = {
  intent: 'continue' | 'completed';
} & ApiParams;

const progressCountRequest = (
  { fetch, intent }: ProgressCountParams,
) =>
  api({ fetch })
    .sync
    .progress
    .upNext
    .nitro({
      query: {
        page: 1,
        limit: 1,
        intent,
      },
    });

export const progressCountQuery = defineQuery({
  key: 'progressCount',
  invalidations: [
    InvalidateAction.MarkAsWatched('show'),
    InvalidateAction.MarkAsWatched('episode'),
    InvalidateAction.Drop('show'),
    InvalidateAction.Restore,
    InvalidateAction.Rewatching('show'),
  ],
  dependencies: (params) => [params.intent],
  request: progressCountRequest,
  mapper: (response) => ({ count: extractItemCount(response.headers) }),
  schema: CountResultSchema,
  ttl: time.minutes(30),
});
