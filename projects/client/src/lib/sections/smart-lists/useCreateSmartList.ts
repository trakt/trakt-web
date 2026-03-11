import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { createSmartListRequest } from '$lib/requests/queries/users/createSmartListRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';
import { AnalyticsEvent } from '../../features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../features/analytics/useTrack.ts';
import type { ListTarget } from './models/ListTarget.ts';

const ORIGIN = 'https://app.trakt.tv';

type CreateListProps = {
  name: string;
  type: MediaType;
  target: ListTarget;
  filterMap: Record<string, string>;
};

function toPayload({ name, type, target, filterMap }: CreateListProps) {
  const params = new URLSearchParams(filterMap).toString();

  return {
    name,
    url: `${ORIGIN}/${type}s/${target}?${params}`,
  };
}

export function useCreateSmartList() {
  const isCreating = new BehaviorSubject(false);

  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.SmartListCreate);

  const createList = async (props: CreateListProps) => {
    isCreating.next(true);
    track();

    const payload = toPayload(props);
    await createSmartListRequest(payload);

    await invalidate(InvalidateAction.SmartList.Created);

    isCreating.next(false);
  };

  return {
    createList,
    isCreating: isCreating.asObservable(),
  };
}
