import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { deleteListRequest } from '$lib/requests/queries/users/deleteListRequest.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { map } from 'rxjs';

export function useDeleteList(list: MediaListSummary) {
  const { track } = useTrack(AnalyticsEvent.ListDelete);

  const deletion = useMutation(defineMutation({
    key: 'list:delete',
    request: () =>
      deleteListRequest({
        userId: assertDefined(
          list.user.slug,
          'Expected user list to have a user slug',
        ),
        listId: list.slug,
      }),
    invalidations: [InvalidateAction.List.Deleted],
  }));

  const deleteList = async () => {
    track();
    await deletion.mutate();
  };

  return {
    isDeleting: deletion.isPending,
    isDeleted: deletion.result.pipe(map(({ data }) => data ?? false)),
    deleteList,
  };
}
