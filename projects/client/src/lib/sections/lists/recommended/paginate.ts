import { map, type OperatorFunction } from 'rxjs';

/**
 * RxJS operator that adds in-memory pagination to an Observable array.
 * 
 * @example
 * ```typescript
 * const allItems$ = of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
 * const page1$ = allItems$.pipe(
 *   paginate({ page: 1, limit: 3 })
 * );
 * // Emits [1, 2, 3]
 * ```
 */
export const paginate = <T>({ page, limit }: {
  page: number;
  limit: number;
}): OperatorFunction<T[], T[]> => {
  const from = (page - 1) * limit;
  const to = page * limit;

  return map((items) => items.slice(from, to));
};
