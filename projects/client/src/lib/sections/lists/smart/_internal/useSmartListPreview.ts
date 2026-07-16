import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';
import { smartListItemsQuery } from '$lib/requests/queries/smart-lists/smartListItemsQuery.ts';
import { map } from 'rxjs';
import { usePaginatedListQuery } from '../../stores/usePaginatedListQuery.ts';

const previewLimit = 8;

export function useSmartListPreview(list: SmartList) {
  const { list: items, isLoading } = usePaginatedListQuery(
    smartListItemsQuery({ slug: list.slug, limit: previewLimit }),
  );

  return {
    isLoading,
    posters: items.pipe(
      map((entries) =>
        entries
          .map((entry) => entry.poster.url.thumb)
          .slice(0, previewLimit)
      ),
    ),
  };
}
