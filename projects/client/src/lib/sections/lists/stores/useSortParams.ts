import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { distinctUntilChanged, map, type Observable } from 'rxjs';

type SortParams = {
  sortBy: string | Nil;
  sortHow: string | Nil;
};

export function useSortParams(): Observable<SortParams> {
  const { url } = useParameters();

  return url.pipe(
    map(($url) => ({
      sortBy: $url.searchParams.get('sort_by'),
      sortHow: $url.searchParams.get('sort_how'),
    })),
    distinctUntilChanged((a, b) =>
      a.sortBy === b.sortBy && a.sortHow === b.sortHow
    ),
  );
}
