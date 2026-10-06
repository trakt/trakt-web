import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { createSmartListRequest } from '$lib/requests/queries/users/createSmartListRequest.ts';
import { AnalyticsEvent } from '../../features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../features/analytics/useTrack.ts';
import { toSmartListWrite } from './_internal/toSmartListWrite.ts';
import type { ListTarget } from './models/ListTarget.ts';

type CreateListProps = {
  name: string;
  type: DiscoverMode;
  target: ListTarget;
  filterMap: Record<string, string>;
};

export function useCreateSmartList() {
  const { track } = useTrack(AnalyticsEvent.SmartListCreate);

  const creation = useMutation(defineMutation({
    key: 'smart-list:create',
    request: (props: CreateListProps) =>
      createSmartListRequest({ body: toSmartListWrite(props) }),
    invalidations: [InvalidateAction.SmartList.Created],
  }));

  const createList = async (props: CreateListProps) => {
    track();

    return await creation.mutate(props).catch(() => null);
  };

  return {
    createList,
    isCreating: creation.isPending,
  };
}
