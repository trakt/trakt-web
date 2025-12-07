import { smartListQuery } from '$lib/requests/queries/users/smartListQuery.ts';
import { DEFAULT_SMART_LIST_LIMIT } from '$lib/utils/constants.ts';
import type { MediaType } from '../../../requests/models/MediaType.ts';
import { usePaginatedListQuery } from '../stores/usePaginatedListQuery.ts';

export function useSmartLists(type: MediaType) {
  return usePaginatedListQuery(smartListQuery({
    type,
    limit: DEFAULT_SMART_LIST_LIMIT,
  }));
}
