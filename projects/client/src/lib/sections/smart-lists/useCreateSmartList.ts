import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { createSmartListRequest } from '$lib/requests/queries/users/createSmartListRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import type { SmartListWriteRequest } from '@trakt/api';
import { BehaviorSubject } from 'rxjs';
import { AnalyticsEvent } from '../../features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../features/analytics/useTrack.ts';
import type { ListTarget } from './models/ListTarget.ts';
import { toSmartListFilters } from './toSmartListFilters.ts';

const MEDIA_TYPES: Record<DiscoverMode, SmartListWriteRequest['media_type']> = {
  movie: 'movies',
  show: 'shows',
  media: 'media',
};

type CreateListProps = {
  name: string;
  type: DiscoverMode;
  target: ListTarget;
  filterMap: Record<string, string>;
};

function toPayload(
  { name, type, target, filterMap }: CreateListProps,
): SmartListWriteRequest {
  return {
    name,
    source: target as SmartListWriteRequest['source'],
    media_type: MEDIA_TYPES[type],
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
