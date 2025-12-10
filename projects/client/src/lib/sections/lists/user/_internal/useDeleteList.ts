import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { deleteListRequest } from '$lib/requests/queries/users/deleteListRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { BehaviorSubject } from 'rxjs';

export function useDeleteList(list: MediaListSummary) {
  const isDeleting = new BehaviorSubject(false);
  const isDeleted = new BehaviorSubject(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.ListDelete);

  const deleteList = async () => {
    isDeleting.next(true);
    track();

    const result = await deleteListRequest({
      userId: assertDefined(
        list.user.slug,
        'Expected user list to have a user slug',
      ),
      listId: list.slug,
    });

    await invalidate(InvalidateAction.List.Deleted);

    isDeleted.next(result);
    isDeleting.next(false);
  };

  return {
    isDeleting: isDeleting.asObservable(),
    isDeleted: isDeleted.asObservable(),
    deleteList,
  };
}
