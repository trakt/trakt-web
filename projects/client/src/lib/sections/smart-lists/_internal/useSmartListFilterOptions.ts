import { useQuery } from '$lib/features/query/useQuery.ts';
import type { SmartListFilterOptionKind } from '$lib/requests/models/SmartListFilterOptionKind.ts';
import { smartListFilterOptionsQuery } from '$lib/requests/queries/smart-lists/smartListFilterOptionsQuery.ts';
import { time } from '$lib/utils/timing/time.ts';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  type Observable,
  shareReplay,
  startWith,
} from 'rxjs';

type UseSmartListFilterOptionsProps = {
  kind: SmartListFilterOptionKind;
  query$: Observable<string>;
};

export function useSmartListFilterOptions(
  { kind, query$ }: UseSmartListFilterOptionsProps,
) {
  const settled$ = query$.pipe(
    map((value) => value.trim()),
    debounceTime(time.seconds(0.3)),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  const query = useQuery(
    settled$.pipe(
      map((value) => smartListFilterOptionsQuery({ kind, query: value })),
    ),
  );

  const isLoading = combineLatest([
    query$,
    settled$.pipe(startWith('')),
    query.pipe(startWith(undefined)),
  ]).pipe(
    map(([value, settled, $query]) =>
      value.trim() !== settled || ($query?.isFetching ?? false)
    ),
    distinctUntilChanged(),
  );

  return {
    options: query.pipe(
      map(($query) => $query.data ?? []),
      startWith([]),
    ),
    isLoading,
  };
}
