import { useQuery } from '$lib/features/query/useQuery.ts';
import { smartListQuery } from '$lib/requests/queries/users/smartListQuery.ts';
import { smartListTemplatesQuery } from '$lib/requests/queries/smart-lists/smartListTemplatesQuery.ts';
import { useBannerDismissal } from '$lib/sections/banner/useBannerDismissal.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import { usePaginatedListQuery } from '../../stores/usePaginatedListQuery.ts';
import { getVisibleSmartListTemplates } from './getVisibleSmartListTemplates.ts';

export function useSmartListTemplates(mode$: Observable<DiscoverMode>) {
  const { list: lists, isLoading: areListsLoading } = usePaginatedListQuery(
    smartListQuery({}),
  );
  const query = useQuery(smartListTemplatesQuery());
  const { isDismissed, dismiss } = useBannerDismissal(
    'smart-list-templates',
    'hidden',
  );

  const templates = combineLatest([
    lists,
    query.pipe(map(($query) => $query.data ?? [])),
    isDismissed,
    mode$,
  ]).pipe(
    map(([$lists, $templates, $isDismissed, $mode]) =>
      $isDismissed ? [] : getVisibleSmartListTemplates({
        templates: $templates,
        lists: $lists,
        mode: $mode,
      })
    ),
  );

  const isLoading = combineLatest([
    areListsLoading,
    query.pipe(map(toLoadingState)),
  ]).pipe(map((states) => states.some(Boolean)));

  return { templates, isLoading, hide: dismiss };
}
