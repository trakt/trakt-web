import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import type { ExtendedMediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { removeFromListRequest } from '$lib/requests/queries/users/removeFromListRequest.ts';
import { toBulkPayload } from '$lib/sections/media-actions/_internal/toBulkPayload.ts';
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
  const { track } = useTrack(AnalyticsEvent.List);

  const ids = media.map(({ id }) => id);

  const body = toBulkPayload(type, ids);

  const invalidationType = type === 'episode' || type === 'season'
    ? 'show'
    : type;

  const removal = useMutation(defineMutation({
    key: 'list:remove',
    request: () => removeFromListRequest({ body, listId: props.listId }),
    invalidations: [InvalidateAction.Listed(invalidationType)],
  }));

  const removeFromList = async () => {
    track({ action: 'remove' });

    await removal.mutate();
  };

  return {
    isListUpdating: removal.isPending,
    removeFromList,
  };
}
