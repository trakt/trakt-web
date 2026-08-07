import { createBulkIntlOverlay } from '$lib/features/intl-overlay/createBulkIntlOverlay.ts';
import { listItemTargets } from '$lib/features/intl-overlay/listItemTargets.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { usePaginatedListQuery } from '$lib/sections/lists/stores/usePaginatedListQuery.ts';
import { listToQuery } from './_internal/listToQuery.ts';
import type { ListToQueryProps } from './_internal/ListToQueryProps.ts';

export function useListItems(props: ListToQueryProps) {
  const { list: baseList, isLoading: baseLoading, ...rest } =
    usePaginatedListQuery(listToQuery(props));
  const overlay = createBulkIntlOverlay<ListItem>({
    getTargets: listItemTargets,
  });
  return {
    list: baseList.pipe(overlay.operator),
    isLoading: withOverlayLoading(baseLoading, overlay.intlLoading$),
    ...rest,
  };
}
