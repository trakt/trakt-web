import { useQuery } from '$lib/features/query/useQuery.ts';
import { smartListQuery } from '$lib/requests/queries/users/smartListQuery.ts';
import { smartListTemplatesQuery } from '$lib/requests/queries/smart-lists/smartListTemplatesQuery.ts';
import { useBannerDismissal } from '$lib/sections/banner/useBannerDismissal.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { anyTrue } from '$lib/utils/store/anyTrue.ts';
import { combineLatest, filter, map, type Observable, startWith } from 'rxjs';
import { usePaginatedListQuery } from '../../stores/usePaginatedListQuery.ts';
import { getSmartListTemplatesPresentation } from './getSmartListTemplatesPresentation.ts';
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
    mode$,
  ]).pipe(
    map(([$lists, $templates, $mode]) =>
      getVisibleSmartListTemplates({
        templates: $templates,
        lists: $lists,
        mode: $mode,
      })
    ),
  );

  const presentation = combineLatest([lists, areListsLoading, isDismissed])
    .pipe(
      filter(([, $isLoading]) => !$isLoading),
      map(([$lists, , $isHidden]) =>
        getSmartListTemplatesPresentation({
          listCount: $lists.length,
          isHidden: $isHidden,
        })
      ),
      startWith(null),
    );

  const isLoading = anyTrue([
    areListsLoading,
    query.pipe(map(toLoadingState)),
  ]);

  return { templates, presentation, isLoading, hide: dismiss };
}
