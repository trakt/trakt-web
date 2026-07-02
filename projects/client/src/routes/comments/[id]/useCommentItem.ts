import { useQuery } from '$lib/features/query/useQuery.ts';
import { commentItemQuery } from '$lib/requests/queries/comments/commentItemQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, type Observable } from 'rxjs';

export function useCommentItem(id$: Observable<number>) {
  const query = useQuery(id$.pipe(map((id) => commentItemQuery({ id }))));

  return {
    target: query.pipe(map(($query) => $query.data)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
