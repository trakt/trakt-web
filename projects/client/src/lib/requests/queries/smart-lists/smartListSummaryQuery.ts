import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import {
  mapToSmartList,
  SmartListSchema,
} from '$lib/requests/queries/users/smartListQuery.ts';
import { time } from '$lib/utils/timing/time.ts';

type SmartListSummaryParams = { listId: string } & ApiParams;

const smartListSummaryRequest = (
  { fetch, listId }: SmartListSummaryParams,
) =>
  api({ fetch })
    .smart_lists
    .summary({
      params: {
        list_id: listId,
      },
    });

export const smartListSummaryQuery = defineQuery({
  key: 'smartListSummary',
  invalidations: [
    InvalidateAction.SmartList.Created,
    InvalidateAction.SmartList.Deleted,
  ],
  dependencies: (params) => [params.listId],
  request: smartListSummaryRequest,
  mapper: (response) => mapToSmartList(response.body),
  schema: SmartListSchema,
  ttl: time.minutes(30),
});
