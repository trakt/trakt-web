import { useQuery } from '$lib/features/query/useQuery.ts';
import { showProgressQuery } from '$lib/requests/queries/shows/showProgressQuery.ts';
import { map } from 'rxjs';

export function useShowProgress(slug: string) {
  const progress = useQuery(showProgressQuery({ slug }));

  return {
    progress: progress.pipe(map(($progress) => $progress.data)),
  };
}
