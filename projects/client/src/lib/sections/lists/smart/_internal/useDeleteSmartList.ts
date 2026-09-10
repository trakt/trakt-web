import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { deleteSmartListRequest } from '$lib/requests/queries/users/deleteSmartListRequest.ts';
import { AnalyticsEvent } from '../../../../features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../../../features/analytics/useTrack.ts';

type DeleteListProps = {
  slug: string;
};

export function useDeleteSmartList() {
  const { track } = useTrack(AnalyticsEvent.SmartListDelete);

  const deletion = useMutation(defineMutation({
    key: 'smart-list:delete',
    request: ({ slug }: DeleteListProps) => deleteSmartListRequest({ slug }),
    invalidations: [InvalidateAction.SmartList.Deleted],
  }));

  const deleteList = async ({ slug }: DeleteListProps) => {
    track();

    await deletion.mutate({ slug });
  };

  return {
    deleteList,
    isDeleting: deletion.isPending,
  };
}
