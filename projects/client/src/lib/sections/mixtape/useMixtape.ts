import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { mixtapeHistoryQuery } from '$lib/requests/queries/mixtape/mixtapeHistoryQuery.ts';
import type { Mixtape } from '$lib/requests/models/Mixtape.ts';
import { mixtapePicksQuery } from '$lib/requests/queries/mixtape/mixtapePicksQuery.ts';
import { mixtapeQuery } from '$lib/requests/queries/mixtape/mixtapeQuery.ts';
import { keepPreviousData } from '@tanstack/query-core';
import { dedupe } from '$lib/utils/array/dedupe.ts';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  type Observable,
  startWith,
} from 'rxjs';
import { MAX_MIXTAPE_CANDIDATES } from './_internal/MAX_MIXTAPE_CANDIDATES.ts';

type MixtapeRequest = {
  type: MediaType;
  picks: number[];
};

const EMPTY_MIXTAPE: Mixtape = { fits: [], suggestions: [] };
const SEARCH_DEBOUNCE = 300;

export function useMixtape(
  request$: Observable<MixtapeRequest>,
  search$: Observable<string>,
) {
  const type$ = request$.pipe(
    map(({ type }) => type),
    distinctUntilChanged(),
  );
  const history = useQuery(
    type$.pipe(map((type) => mixtapeHistoryQuery({ type }))),
  );
  const history$ = history.pipe(map((query) => query.data ?? []));

  const typedTerm$ = search$.pipe(
    map((term) => term.trim()),
    distinctUntilChanged(),
  );
  const searchTerm$ = typedTerm$.pipe(debounceTime(SEARCH_DEBOUNCE));
  const search = useQuery(
    combineLatest([type$, searchTerm$]).pipe(
      map(([type, term]) => ({
        ...mixtapeHistoryQuery({ type, search: term }),
        enabled: term.length > 0,
      })),
    ),
  );
  const searchResults$ = combineLatest([searchTerm$, search]).pipe(
    map(([term, query]) => (term ? query.data ?? [] : [])),
  );
  const isSearchLoading$ = combineLatest([
    typedTerm$,
    searchTerm$.pipe(startWith('')),
    search,
  ]).pipe(
    map(([typed, term, query]) =>
      typed.length > 0 && (typed !== term || query.isLoading)
    ),
  );

  const mixtape = useQuery(
    combineLatest([request$, history, searchResults$]).pipe(
      map(([{ type, picks }, historyQuery, searched]) => {
        const options = mixtapeQuery({
          type,
          picks,
          candidates: dedupe(
            (id) => id,
            [...searched, ...(historyQuery.data ?? [])].map(({ id }) => id),
          ).slice(0, MAX_MIXTAPE_CANDIDATES),
        });
        return {
          ...options,
          enabled: options.enabled && !historyQuery.isLoading,
          placeholderData: keepPreviousData,
        };
      }),
    ),
  );

  const known$ = combineLatest([history$, searchResults$]).pipe(
    map(([items, searched]) => [...items, ...searched]),
  );

  const missingPicks = useQuery(
    combineLatest([request$, known$]).pipe(
      map(([{ type, picks }, items]) =>
        mixtapePicksQuery({
          type,
          ids: picks.filter((id) => !items.some((media) => media.id === id)),
        })
      ),
    ),
  );
  const picked$ = combineLatest([
    request$,
    known$,
    missingPicks.pipe(map((query) => query.data ?? [])),
  ]).pipe(
    map(([{ picks }, items, fetched]) =>
      picks.flatMap((id) => {
        const media = items.find((item) => item.id === id) ??
          fetched.find((item) => item.id === id);
        return media ? [media] : [];
      })
    ),
  );

  return {
    history: history$,
    searchResults: searchResults$,
    isSearchLoading: isSearchLoading$,
    picked: picked$,
    isHistoryLoading: history.pipe(map((query) => query.isLoading)),
    mixtape: mixtape.pipe(map((query) => query.data ?? EMPTY_MIXTAPE)),
    isMixtapeLoading: mixtape.pipe(
      map((query) => query.isLoading || query.isPlaceholderData),
    ),
  };
}
