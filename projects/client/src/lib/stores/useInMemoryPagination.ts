import { BehaviorSubject, combineLatest, map, type Observable } from 'rxjs';
import { readable } from 'svelte/store';

/**
 * Creates in-memory infinite scroll pagination for an Observable array.
 *
 * @example
 * ```typescript
 * const allItems$ = of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
 * const { list, hasNextPage, fetchNextPage } = useInMemoryPagination(allItems$, {
 *   page: 1,
 *   limit: 3
 * });
 * // list emits [1, 2, 3]
 * // hasNextPage emits true
 * // fetchNextPage() loads more items
 * ```
 */
export function useInMemoryPagination<T>(
  source$: Observable<T[]>,
  { page = 1, limit }: { page?: number; limit: number },
) {
  const page$ = new BehaviorSubject<number>(page);

  const list = combineLatest([source$, page$]).pipe(
    map(([items, currentPage]) => items.slice(0, currentPage * limit)),
  );

  const hasNextPage = combineLatest([source$, page$]).pipe(
    map(([items, currentPage]) => {
      const totalItems = items.length;
      const nextPageEnd = currentPage * limit;
      return totalItems > nextPageEnd;
    }),
  );

  const fetchNextPage = readable(async () => {
    await Promise.resolve(page$.next(page$.value + 1));
  });

  return {
    list,
    hasNextPage,
    fetchNextPage,
  };
}
