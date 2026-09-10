import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import type { ListTarget } from '$lib/models/ListTarget.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { addToListRequest } from '$lib/requests/queries/users/addToListRequest.ts';
import { removeFromListRequest } from '$lib/requests/queries/users/removeFromListRequest.ts';
import type { UserList } from '$lib/requests/queries/users/userListsQuery.ts';
import { toBulkPayload } from '$lib/sections/media-actions/_internal/toBulkPayload.ts';
import { anyTrue } from '$lib/utils/store/anyTrue.ts';

type UseListProps = { list: UserList } & ListTarget;

export function useList({ list, type, media }: UseListProps) {
  const { track } = useTrack(AnalyticsEvent.List);
  const body = toBulkPayload(type, [media.id]);

  const target = {
    listId: list.id,
    userId: list.ownerId,
    body,
  };
  const invalidations = [InvalidateAction.Listed(type)];

  const addition = useMutation(defineMutation({
    key: 'list:add',
    request: () => addToListRequest(target),
    invalidations,
  }));

  const removal = useMutation(defineMutation({
    key: 'list:remove',
    request: () => removeFromListRequest(target),
    invalidations,
  }));

  const addToList = async () => {
    track({ action: 'add' });

    await addition.mutate();
  };

  const removeFromList = async () => {
    track({ action: 'remove' });

    await removal.mutate();
  };

  const isListUpdating = anyTrue([addition.isPending, removal.isPending]);

  return {
    addToList,
    removeFromList,
    isListUpdating,
  };
}
