import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { createSmartListRequest } from '$lib/requests/queries/users/createSmartListRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';
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
  const isCreating = new BehaviorSubject(false);

  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.SmartListCreate);

  const createList = async (props: CreateListProps) => {
    isCreating.next(true);
    track();

    const body = toSmartListWrite(props);
    const slug = await createSmartListRequest({ body })
      .catch(() => null);

    if (slug) {
      await invalidate(InvalidateAction.SmartList.Created);
    }

    isCreating.next(false);

    return slug;
  };

  return {
    createList,
    isCreating: isCreating.asObservable(),
  };
}
