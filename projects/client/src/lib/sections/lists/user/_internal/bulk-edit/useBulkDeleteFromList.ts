import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { ListItem } from '$lib/requests/models/ListItem.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { removeFromListRequest } from '$lib/requests/queries/users/removeFromListRequest.ts';
import { toBulkMediaPayload } from './toBulkMediaPayload.ts';

export function useBulkDeleteFromList(list: MediaListSummary) {
  const { track } = useTrack(AnalyticsEvent.List);

  const deletion = useMutation(defineMutation({
    key: 'list:bulk-remove',
    request: (items: ListItem[]) =>
      removeFromListRequest({
        listId: list.slug,
        body: toBulkMediaPayload(items),
      }),
    invalidations: [
      InvalidateAction.Listed('movie'),
      InvalidateAction.Listed('show'),
    ],
  }));

  const deleteItems = async (items: ListItem[]) => {
    if (items.length === 0) {
      return false;
    }

    track({ action: 'remove' });

    return await deletion.mutate(items);
  };

  return {
    isDeleting: deletion.isPending,
    deleteItems,
  };
}
