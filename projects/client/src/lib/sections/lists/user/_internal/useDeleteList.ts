import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { deleteListRequest } from '$lib/requests/queries/users/deleteListRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { derived, writable } from 'svelte/store';

export function useDeleteList(list: MediaListSummary) {
  const isDeleting = writable(false);
  const isDeleted = writable(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.ListDelete);
  const { confirm } = useConfirm();

  const deleteList = async () => {
    isDeleting.set(true);
    track();

    const result = await deleteListRequest({
      userId: assertDefined(
        list.user.slug,
        'Expected user list to have a user slug',
      ),
      listId: list.slug,
    });

    await invalidate(InvalidateAction.List.Deleted);

    isDeleted.set(result);
    isDeleting.set(false);
  };

  return {
    isDeleting: derived(isDeleting, ($isDeleting) => $isDeleting),
    isDeleted: derived(isDeleted, ($isDeleted) => $isDeleted),
    deleteList: confirm({
      type: ConfirmationType.DeleteList,
      name: list.name,
      onConfirm: deleteList,
    }),
  };
}
