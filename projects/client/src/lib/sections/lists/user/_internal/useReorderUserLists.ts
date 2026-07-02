import { useAllPagesInfiniteQuery } from '$lib/features/query/useQuery.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { personalListsQuery } from '$lib/requests/queries/users/personalListsQuery.ts';
import { map } from 'rxjs';
import type { ReorderableListItem } from './models/ReorderableListItem.ts';

const reorderPageSize = 100;

function uniqueByKey(entries: MediaListSummary[]): MediaListSummary[] {
  const seen = new Set<string>();
  return entries.filter((item) => {
    if (seen.has(item.key)) return false;
    seen.add(item.key);
    return true;
  });
}

function mapListToReorderableItem(
  list: MediaListSummary,
  index: number,
): ReorderableListItem {
  return {
    key: list.key,
    listItemId: list.id,
    rank: index + 1,
    title: list.name,
    posterUrl: list.posters.at(0)?.url.thumb,
  };
}

export function useReorderUserLists(slug: string) {
  const query = useAllPagesInfiniteQuery(personalListsQuery({
    slug,
    limit: reorderPageSize,
    sortBy: 'rank',
    sortHow: 'asc',
  }));

  const isLoading = query.pipe(
    map(($query) =>
      $query.isPending || $query.isFetchingNextPage || $query.hasNextPage
    ),
  );

  const list = query.pipe(
    map(($query) => {
      if ($query.isPending || $query.isFetchingNextPage || $query.hasNextPage) {
        return [];
      }

      const entries = $query.data?.pages.flatMap((page) => page.entries) ?? [];
      return uniqueByKey(entries).map(mapListToReorderableItem);
    }),
  );

  return { isLoading, list };
}
