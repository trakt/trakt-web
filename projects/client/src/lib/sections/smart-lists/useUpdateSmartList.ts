import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { SmartListFilters } from '$lib/requests/queries/users/smartListQuery.ts';
import { updateSmartListRequest } from '$lib/requests/queries/users/updateSmartListRequest.ts';
import { AnalyticsEvent } from '../../features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../features/analytics/useTrack.ts';
import { toSmartListWrite } from './_internal/toSmartListWrite.ts';
import type { ListTarget } from './models/ListTarget.ts';

type UpdateListProps = {
  slug: string;
  name: string;
  type: DiscoverMode;
  target?: ListTarget;
  filterMap: Record<string, string>;
  baseFilters: SmartListFilters;
};

function toUpdateBody({ slug: _slug, ...props }: UpdateListProps) {
  const { source, ...write } = toSmartListWrite(props);

  return source ? { ...write, source } : write;
}

export function useUpdateSmartList() {
  const { track } = useTrack(AnalyticsEvent.SmartListUpdate);

  const update = useMutation(defineMutation({
    key: 'smart-list:update',
    request: (props: UpdateListProps) =>
      updateSmartListRequest({ slug: props.slug, body: toUpdateBody(props) }),
    invalidations: [InvalidateAction.SmartList.Edited],
  }));

  const updateList = async (props: UpdateListProps) => {
    track();

    const isUpdated = await update.mutate(props).catch(() => false);

    return isUpdated ? props.slug : null;
  };

  return {
    updateList,
    isUpdating: update.isPending,
  };
}
