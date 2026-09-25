import { type Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { typeToMyCommentsQuery } from './typeToMyCommentsQuery.ts';
import type { UseMyCommentsProps } from './UseMyCommentsProps.ts';

// A bounded set that never paginates, shaped like useComments for PaginatedList.
export function useMyComments(props$: Observable<UseMyCommentsProps>) {
  const query = useQuery(props$.pipe(map(typeToMyCommentsQuery)));

  return {
    list: query.pipe(
      map((result) =>
        [...(result.data ?? [])].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        )
      ),
    ),
    isLoading: query.pipe(map(toLoadingState)),
    hasNextPage: of(false),
    fetchNextPage: async () => {},
  };
}
