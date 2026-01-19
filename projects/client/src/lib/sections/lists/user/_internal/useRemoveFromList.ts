import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import type { ExtendedMediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { removeFromListRequest } from '$lib/requests/queries/users/removeFromListRequest.ts';
import { toBulkPayload } from '$lib/sections/media-actions/_internal/toBulkPayload.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';
/*
  FIXME: this is here temporarily
  Will move to a more generic useList
*/

type UseRemoveFromListProps = {
  listId: string;
} & ExtendedMediaStoreProps;

export function useRemoveFromList(props: UseRemoveFromListProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const isListUpdating = new BehaviorSubject(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.List);

  const ids = media.map(({ id }) => id);

  const body = toBulkPayload(type, ids);

  const removeFromList = async () => {
    isListUpdating.next(true);
    track({ action: 'remove' });

    await removeFromListRequest({
      body,
      listId: props.listId,
    });

    const invalidationType = type === 'episode' || type === 'season'
      ? 'show'
      : type;
    await invalidate(InvalidateAction.Listed(invalidationType));

    isListUpdating.next(false);
  };

  return {
    isListUpdating,
    removeFromList,
  };
}
