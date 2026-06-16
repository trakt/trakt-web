import { multicast } from '$lib/utils/store/multicast.ts';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  type Observable,
} from 'rxjs';

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

  const paged = combineLatest([source$, page$]).pipe(
    map(([items, currentPage]) => {
      const pageEnd = currentPage * limit;
      return {
        list: items.slice(0, pageEnd),
        hasNextPage: items.length > pageEnd,
      };
    }),
    multicast(),
  );

  const list = paged.pipe(map((paged) => paged.list));

  const hasNextPage = paged.pipe(
    map((paged) => paged.hasNextPage),
    distinctUntilChanged(),
  );

  const fetchNextPage = () => {
    page$.next(page$.value + 1);
    return Promise.resolve();
  };

  return {
    list,
    hasNextPage,
    fetchNextPage,
  };
}
