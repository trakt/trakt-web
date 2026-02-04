import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { addToListRequest } from '$lib/requests/queries/users/addToListRequest.ts';
import { removeFromListRequest } from '$lib/requests/queries/users/removeFromListRequest.ts';
import type { UserList } from '$lib/requests/queries/users/userListsQuery.ts';
import {
  toBulkPayload,
} from '$lib/sections/media-actions/_internal/toBulkPayload.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';

type UseListProps = { list: UserList } & MediaStoreProps;

export function useList(props: UseListProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const isListUpdating = new BehaviorSubject(false);
  const { invalidate } = useInvalidator();

  const { track } = useTrack(AnalyticsEvent.List);
  const ids = media.map(({ id }) => id);
  const body = toBulkPayload(type, ids);

  const addToList = async () => {
    if (type === 'episode') {
      return;
    }

    isListUpdating.next(true);
    track({ action: 'add' });

    await addToListRequest({
      listId: props.list.id,
      userId: props.list.ownerId,
      body,
    });
    await invalidate(InvalidateAction.Listed(type));

    isListUpdating.next(false);
  };

  const removeFromList = async () => {
    if (type === 'episode') {
      return;
    }

    isListUpdating.next(true);
    track({ action: 'remove' });

    await removeFromListRequest({
      listId: props.list.id,
      userId: props.list.ownerId,
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
