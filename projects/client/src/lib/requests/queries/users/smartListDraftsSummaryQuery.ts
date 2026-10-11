import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import {
  type SmartListDraftsSummary,
  SmartListDraftsSummarySchema,
} from '../../models/SmartListDraftsSummary.ts';

type SmartListDraftsSummaryParams = ApiParams;

const smartListDraftsSummaryRequest = (
  { fetch }: SmartListDraftsSummaryParams,
) =>
  api({ fetch })
    .users
    .smartListDrafts
    .summary({
      params: { id: 'me' },
    });

export const smartListDraftsSummaryQuery = defineQuery({
  key: 'smartListDraftsSummary',
  invalidations: [
    InvalidateAction.List.Edited,
    InvalidateAction.List.Deleted,
    InvalidateAction.Listed('movie'),
    InvalidateAction.Listed('show'),
    InvalidateAction.SmartList.Created,
  ],
  dependencies: [],
  request: smartListDraftsSummaryRequest,
  mapper: (response): SmartListDraftsSummary => ({
    convertibleCount: response.body.convertible_count,
    bestConfidence: response.body.best_confidence,
    lists: response.body.lists.map((list) => ({
      slug: list.ids.slug,
      name: list.name,
      count: list.item_count,
      confidence: list.confidence,
    })),
  }),
  schema: SmartListDraftsSummarySchema,
  ttl: time.minutes(15),
  refetchOnWindowFocus: false,
});
