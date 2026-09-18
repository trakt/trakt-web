import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import type { ListTarget } from '$lib/models/ListTarget.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { addToListRequest } from '$lib/requests/queries/users/addToListRequest.ts';
import { removeFromListRequest } from '$lib/requests/queries/users/removeFromListRequest.ts';
import type { UserList } from '$lib/requests/queries/users/userListsQuery.ts';
import { toBulkPayload } from '$lib/sections/media-actions/_internal/toBulkPayload.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';

type UseListProps = { list: UserList } & ListTarget;

export function useList({ list, type, media }: UseListProps) {
  const isListUpdating = new BehaviorSubject(false);
  const { invalidate } = useInvalidator();

  const { track } = useTrack(AnalyticsEvent.List);
  const body = toBulkPayload(type, [media.id]);

  const addToList = async () => {
    isListUpdating.next(true);
    track({ action: 'add' });

    await addToListRequest({
      listId: list.id,
      userId: list.ownerId,
      body,
    });
    await invalidate(InvalidateAction.Listed(type));

    isListUpdating.next(false);
  };

  const removeFromList = async () => {
    isListUpdating.next(true);
    track({ action: 'remove' });

    await removeFromListRequest({
      listId: list.id,
      userId: list.ownerId,
      body,
    });
    await invalidate(InvalidateAction.Listed(type));

    isListUpdating.next(false);
  };

  return {
    addToList,
    removeFromList,
    isListUpdating,
  };
}
