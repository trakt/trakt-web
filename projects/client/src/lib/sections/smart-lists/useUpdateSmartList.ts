import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { SmartListFilters } from '$lib/requests/queries/users/smartListQuery.ts';
import { updateSmartListRequest } from '$lib/requests/queries/users/updateSmartListRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';
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

export function useUpdateSmartList() {
  const isUpdating = new BehaviorSubject(false);

  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.SmartListUpdate);

  const updateList = async ({ slug, ...props }: UpdateListProps) => {
    isUpdating.next(true);
    track();

    const { source, ...write } = toSmartListWrite(props);
    const body = source ? { ...write, source } : write;

    const isUpdated = await updateSmartListRequest({ slug, body })
      .catch(() => false);

    if (isUpdated) {
      await invalidate(InvalidateAction.SmartList.Updated);
    }

    isUpdating.next(false);

    return isUpdated ? slug : null;
  };

  return {
    updateList,
    isUpdating: isUpdating.asObservable(),
  };
}
