import { useQuery } from '$lib/features/query/useQuery.ts';
import { showProgressQuery } from '$lib/requests/queries/shows/showProgressQuery.ts';
import { derived } from 'svelte/store';

export function useShowProgress(slug: string) {
  const progress = useQuery(showProgressQuery({ slug }));

  return {
    progress: derived(progress, ($progress) => $progress.data),
  };
}
