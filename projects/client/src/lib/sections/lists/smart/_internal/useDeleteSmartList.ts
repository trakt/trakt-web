import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { deleteSmartListRequest } from '$lib/requests/queries/users/deleteSmartListRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';
import { AnalyticsEvent } from '../../../../features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../../../features/analytics/useTrack.ts';

type DeleteListProps = {
  slug: string;
};

export function useDeleteSmartList() {
  const isDeleting = new BehaviorSubject(false);

  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.SmartListDelete);

  const deleteList = async (
    { slug }: DeleteListProps,
  ) => {
    isDeleting.next(true);
    track();

    await deleteSmartListRequest({
      slug,
    });

    await invalidate(InvalidateAction.SmartList.Deleted);

    isDeleting.next(false);
  };

  return {
    deleteList,
    isDeleting: isDeleting.asObservable(),
  };
}
