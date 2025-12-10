import { useQuery } from '$lib/features/query/useQuery.ts';
import { showProgressQuery } from '$lib/requests/queries/shows/showProgressQuery.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map } from 'rxjs';

export function useShowProgress(slug: string) {
  const progress = useQuery(showProgressQuery({ slug }));
  const progress$ = toObservable(progress);

  return {
    progress: progress$.pipe(map((p) => p.data)),
  };
}
