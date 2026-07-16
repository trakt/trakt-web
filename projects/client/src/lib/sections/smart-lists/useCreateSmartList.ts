import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { createSmartListRequest } from '$lib/requests/queries/users/createSmartListRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import type { SmartListWriteRequest } from '@trakt/api';
import { BehaviorSubject } from 'rxjs';
import { AnalyticsEvent } from '../../features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../features/analytics/useTrack.ts';
import type { ListTarget } from './models/ListTarget.ts';
import { toSmartListFilters } from './toSmartListFilters.ts';

type CreateListProps = {
  name: string;
  type: MediaType;
  target: ListTarget;
  filterMap: Record<string, string>;
};

function toPayload(
  { name, type, target, filterMap }: CreateListProps,
): SmartListWriteRequest {
  return {
    name,
    source: target as SmartListWriteRequest['source'],
    media_type: type === 'movie' ? 'movies' : 'shows',
    filters: toSmartListFilters(filterMap),
  };
}

export function useCreateSmartList() {
  const isCreating = new BehaviorSubject(false);

  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.SmartListCreate);

  const createList = async (props: CreateListProps) => {
    isCreating.next(true);
    track();

    const body = toPayload(props);
    await createSmartListRequest({ body });

    await invalidate(InvalidateAction.SmartList.Created);

    isCreating.next(false);
  };

  return {
    createList,
    isCreating: isCreating.asObservable(),
  };
}
