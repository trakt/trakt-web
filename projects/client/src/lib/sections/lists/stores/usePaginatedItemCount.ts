import { combineLatest, map, type Observable } from 'rxjs';
import type { PaginatedItemCount } from './PaginatedItemCount.ts';

type UsePaginatedItemCountProps = {
  query: {
    list: Observable<readonly unknown[]>;
    isLoading: Observable<boolean>;
    hasNextPage: Observable<boolean>;
    itemCount: Observable<number | undefined>;
  };
  isNarrowed: boolean;
};

/*
 * The `x-pagination-item-count` header always reports the unfiltered list
 * total, so it is only trustworthy when nothing narrows the result set. A
 * narrowed view (a specific media type or active filters) has no server-side
 * filtered total, so its count is derived from the loaded entries of the same
 * query observer the item grid uses (no extra requests): exact when the whole
 * result fits a single page, and an approximation (`isPartial`, rendered as
 * `N+`) while more pages remain to be loaded.
 */
export function usePaginatedItemCount(
  { query, isNarrowed }: UsePaginatedItemCountProps,
): Observable<PaginatedItemCount | undefined> {
  if (!isNarrowed) {
    return query.itemCount.pipe(
      map((count) => count == null ? undefined : { count, isPartial: false }),
    );
  }

  return combineLatest([
    query.list,
    query.isLoading,
    query.hasNextPage,
  ]).pipe(
    map(([entries, isLoading, hasNextPage]) => {
      if (isLoading && entries.length === 0) {
        return undefined;
      }

      return {
        count: entries.length,
        isPartial: hasNextPage || isLoading,
      };
    }),
  );
}
