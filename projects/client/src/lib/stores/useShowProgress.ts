import { useQuery } from '$lib/features/query/useQuery.ts';
import { showProgressQuery } from '$lib/requests/queries/shows/showProgressQuery.ts';
import { map, type Observable } from 'rxjs';

export function useShowProgress(slug$: Observable<string>) {
  const progress = useQuery(
    slug$.pipe(map((slug) => showProgressQuery({ slug }))),
  );

  return {
    progress: progress.pipe(map(($progress) => $progress.data)),
    isLoading: progress.pipe(map(($progress) => $progress.isLoading)),
  };
}
