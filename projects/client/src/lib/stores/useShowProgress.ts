import { showProgressQuery } from '$lib/requests/queries/shows/showProgressQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import { createQuery } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export function useShowProgress(slug: string) {
  const progress = createQuery({
    ...showProgressQuery({ slug }),
    staleTime: time.days(1),
  });

  return {
    progress: derived(progress, ($progress) => $progress.data),
  };
}
