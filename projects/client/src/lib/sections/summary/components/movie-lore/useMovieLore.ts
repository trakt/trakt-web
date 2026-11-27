import { movieLoreQuery } from '$lib/requests/queries/movies/movieLoreQuery.ts';
import type { Observable } from 'rxjs';
import { useRecapQuery } from '../recap/useRecapQuery.ts';

type MovieLoreTarget = {
  slug: string;
};

export function useMovieLore(target$: Observable<MovieLoreTarget>) {
  const { isVip, result } = useRecapQuery({
    target$,
    toQuery: ({ target: { slug }, isVip }) => movieLoreQuery({ slug, isVip }),
  });

  return { lore: result, isVip };
}
