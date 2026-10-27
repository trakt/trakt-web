import { showSeasonRecapQuery } from '$lib/requests/queries/shows/showSeasonRecapQuery.ts';
import type { Observable } from 'rxjs';
import { useRecapQuery } from './useRecapQuery.ts';

type SeasonRecapTarget = {
  slug: string;
  season: number;
};

export function useSeasonRecap(target$: Observable<SeasonRecapTarget>) {
  const { isVip, result } = useRecapQuery({
    target$,
    toQuery: ({ target: { slug, season }, isVip }) =>
      showSeasonRecapQuery({ slug, season, isVip }),
  });

  return { recap: result, isVip };
}
