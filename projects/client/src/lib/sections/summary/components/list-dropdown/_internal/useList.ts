import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { addToListRequest } from '$lib/requests/queries/users/addToListRequest.ts';
import { removeFromListRequest } from '$lib/requests/queries/users/removeFromListRequest.ts';
import {
  toBulkPayload,
} from '$lib/sections/media-actions/_internal/toBulkPayload.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { writable } from 'svelte/store';
import { useIsListed } from './useIsListed.ts';

type UseListProps = { list: MediaListSummary } & MediaStoreProps;

export function useList(props: UseListProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const isListUpdating = writable(false);
  const { invalidate } = useInvalidator();

  const { isListed, itemCount } = useIsListed(props);

  const { track } = useTrack(AnalyticsEvent.List);
  const ids = media.map(({ id }) => id);
  const body = toBulkPayload(type, ids);

  const addToList = async () => {
    if (type === 'episode') {
      return;
    }

    isListUpdating.set(true);
    track({ action: 'add' });

    await addToListRequest({
      listId: props.list.slug,
      userId: props.list.user.slug,
      body,
    });
    await invalidate(InvalidateAction.Listed(type));

    isListUpdating.set(false);
  };

  const removeFromList = async () => {
    if (type === 'episode') {
      return;
    }

    isListUpdating.set(true);
    track({ action: 'remove' });

    await removeFromListRequest({
      listId: props.list.slug,
      userId: props.list.user.slug,
      body,
    });
    await invalidate(InvalidateAction.Listed(type));

    isListUpdating.set(false);
  };

  return {
    addToList,
    removeFromList,
    isListUpdating,
    isListed,
    itemCount,
  };
}
