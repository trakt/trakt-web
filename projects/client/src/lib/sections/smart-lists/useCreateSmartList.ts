import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { createSmartListRequest } from '$lib/requests/queries/users/createSmartListRequest.ts';
import type { SmartListWriteRequest } from '@trakt/api';
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
  const { track } = useTrack(AnalyticsEvent.SmartListCreate);

  const creation = useMutation(defineMutation({
    key: 'smart-list:create',
    request: (props: CreateListProps) =>
      createSmartListRequest({ body: toPayload(props) }),
    invalidations: [InvalidateAction.SmartList.Created],
  }));

  const createList = async (props: CreateListProps) => {
    track();

    await creation.mutate(props);
  };

  return {
    createList,
    isCreating: creation.isPending,
  };
}
