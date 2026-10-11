import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import {
  type SmartListDraft,
  SmartListDraftSchema,
} from '../../models/SmartListDraft.ts';
import { SmartListMediaTypeSchema } from '../../models/SmartListMediaType.ts';
import { SmartListSourceSchema } from '../../models/SmartListSource.ts';

type SmartListDraftParams = { userId: string; listId: string } & ApiParams;

const smartListDraftRequest = async (
  { fetch, userId, listId }: SmartListDraftParams,
) => {
  const response = await api({ fetch })
    .users
    .lists
    .list
    .smartListDraft({
      params: {
        id: userId,
        list_id: listId,
      },
    });

  if (response.status === 404) {
    return { ...response, status: 204 as const, body: undefined };
  }

  return response;
};

export const smartListDraftQuery = defineQuery({
  key: 'smartListDraft',
  invalidations: [
    InvalidateAction.List.Edited,
    InvalidateAction.SmartList.Created,
  ],
  dependencies: (params) => [params.userId, params.listId],
  request: smartListDraftRequest,
  mapper: (response): SmartListDraft | null => {
    if (!response.body) {
      return null;
    }

    return {
      source: SmartListSourceSchema.parse(response.body.source),
      mediaType: SmartListMediaTypeSchema.parse(response.body.media_type),
      filters: response.body.filters,
      confidence: response.body.confidence,
    };
  },
  schema: SmartListDraftSchema.nullable(),
  ttl: time.minutes(5),
});
