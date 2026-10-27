import { showRecapStoryQuery } from '$lib/requests/queries/shows/showRecapStoryQuery.ts';
import type { Observable } from 'rxjs';
import { useRecapQuery } from './useRecapQuery.ts';

type ShowRecapStoryTarget = {
  slug: string;
  through: number;
  enabled: boolean;
};

export function useShowRecapStory(target$: Observable<ShowRecapStoryTarget>) {
  const { result } = useRecapQuery({
    target$,
    toQuery: ({ target: { slug, through, enabled }, isVip }) =>
      showRecapStoryQuery({ slug, through, enabled: enabled && isVip }),
  });

  return { story: result };
}
