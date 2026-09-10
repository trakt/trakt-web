import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { addToListRequest } from '$lib/requests/queries/users/addToListRequest.ts';
import { removeFromListRequest } from '$lib/requests/queries/users/removeFromListRequest.ts';
import type { UserList } from '$lib/requests/queries/users/userListsQuery.ts';
import { anyTrue } from '$lib/utils/store/anyTrue.ts';
import {
  toBulkPayload,
} from '$lib/sections/media-actions/_internal/toBulkPayload.ts';
type UseListProps = { list: UserList } & MediaStoreProps;

export function useList(props: UseListProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];

  const { track } = useTrack(AnalyticsEvent.List);
  const ids = media.map(({ id }) => id);
  const body = toBulkPayload(type, ids);

  const target = {
    listId: props.list.id,
    userId: props.list.ownerId,
    body,
  };
  const invalidations = type === 'episode'
    ? []
    : [InvalidateAction.Listed(type)];

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
    if (type === 'episode') {
      return;
    }

    track({ action: 'add' });

    await addition.mutate();
  };

  const removeFromList = async () => {
    if (type === 'episode') {
      return;
    }

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
