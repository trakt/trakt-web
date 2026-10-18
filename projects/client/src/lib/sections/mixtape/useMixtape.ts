import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { mixtapeHistoryQuery } from '$lib/requests/queries/mixtape/mixtapeHistoryQuery.ts';
import type { Mixtape } from '$lib/requests/models/Mixtape.ts';
import { mixtapePicksQuery } from '$lib/requests/queries/mixtape/mixtapePicksQuery.ts';
import { mixtapeQuery } from '$lib/requests/queries/mixtape/mixtapeQuery.ts';
import { mixtapeVectorsQuery } from '$lib/requests/queries/mixtape/mixtapeVectorsQuery.ts';
import { keepPreviousData } from '@tanstack/query-core';
import { dedupe } from '$lib/utils/array/dedupe.ts';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  merge,
  type Observable,
  scan,
  startWith,
} from 'rxjs';
import { mergeMixtapeFits } from './_internal/mergeMixtapeFits.ts';
import { scoreLocalFits } from './_internal/scoreLocalFits.ts';
import { toSearchTerms } from './_internal/toSearchTerms.ts';
import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

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

  const { typed$: typedTerm$, debounced$: searchTerm$ } = toSearchTerms(
    search$,
    SEARCH_DEBOUNCE,
  );
  const search = useQuery(
    combineLatest([type$, searchTerm$]).pipe(
      map(([type, term]) => ({
        ...mixtapeHistoryQuery({ type, search: term }),
        enabled: term.length > 0,
      })),
    ),
  );
  const searchResults$ = combineLatest([searchTerm$, search]).pipe(
    map(([term, query]) => (term ? (query.data ?? []) : [])),
  );
  const isSearchLoading$ = combineLatest([
    typedTerm$,
    searchTerm$,
    search,
  ]).pipe(
    map(
      ([typed, term, query]) =>
        typed.length > 0 && (typed !== term || query.isLoading),
    ),
  );

  const deep = useQuery(
    request$.pipe(
      map(({ type, picks }) =>
        mixtapeQuery({ type, picks, candidates: [], suggestions: false }),
      ),
    ),
  );
  const mixtape = useQuery(
    request$.pipe(
      map(({ type, picks }) => ({
        ...mixtapeQuery({ type, picks, candidates: [], suggestions: true }),
        placeholderData: keepPreviousData,
      })),
    ),
  );
  const deepFits$ = combineLatest([deep, mixtape]).pipe(
    map(([fitsOnly, full]) =>
      dedupe(
        ({ id }) => id,
        [
          ...(fitsOnly.data?.fits ?? []),
          ...(full.isPlaceholderData ? [] : (full.data?.fits ?? [])),
        ],
      ),
    ),
  );

  const seen$ = merge(
    searchResults$,
    deepFits$.pipe(
      map((fits) => fits.flatMap(({ media }) => (media ? [media] : []))),
    ),
  ).pipe(
    scan(
      (seen: ReadonlyArray<MovieEntry | ShowEntry>, found) =>
        dedupe(({ id }) => id, [...found], [...seen]),
      [],
    ),
    startWith([]),
  );
  const known$ = combineLatest([history$, seen$, type$]).pipe(
    map(([items, seen, type]) => [
      ...items,
      ...seen.filter((media) => media.type === type),
    ]),
  );

  const toSortedIds = (ids: ReadonlyArray<number>) =>
    [...new Set(ids)].sort((a, b) => a - b);
  const recentVectors = useQuery(
    combineLatest([type$, history$]).pipe(
      map(([type, items]) =>
        mixtapeVectorsQuery({
          type,
          ids: toSortedIds(items.map(({ id }) => id)),
        }),
      ),
    ),
  );
  const extraVectors = useQuery(
    combineLatest([request$, searchResults$, history$]).pipe(
      map(([{ type, picks }, hits, recent]) => {
        const recentIds = new Set(recent.map(({ id }) => id));
        return mixtapeVectorsQuery({
          type,
          ids: toSortedIds([...picks, ...hits.map(({ id }) => id)]).filter(
            (id) => !recentIds.has(id),
          ),
        });
      }),
    ),
  );
  const localFits$ = combineLatest([
    request$,
    known$,
    recentVectors,
    extraVectors,
  ]).pipe(
    map(([{ picks }, items, recent, extra]) =>
      picks.length === 0
        ? []
        : scoreLocalFits({
            picks,
            candidates: items.map(({ id }) => id),
            vectors: {
              cutoff: recent.data?.cutoff ?? extra.data?.cutoff ?? 1,
              vectors: { ...recent.data?.vectors, ...extra.data?.vectors },
            },
          }),
    ),
  );
  const fits$ = combineLatest([localFits$, deepFits$]).pipe(
    map(([local, deepFits]) => mergeMixtapeFits(local ?? [], deepFits)),
  );
  const isFitsSettling$ = combineLatest([request$, localFits$, deep]).pipe(
    map(
      ([{ picks }, local, query]) =>
        picks.length > 0 && (local?.length ?? 0) === 0 && query.isLoading,
    ),
  );

  const missingPicks = useQuery(
    combineLatest([request$, known$]).pipe(
      map(([{ type, picks }, items]) =>
        mixtapePicksQuery({
          type,
          ids: picks.filter((id) => !items.some((media) => media.id === id)),
        }),
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
        const media =
          items.find((item) => item.id === id) ??
          fetched.find((item) => item.id === id);
        return media ? [media] : [];
      }),
    ),
  );

  return {
    history: history$,
    searchResults: searchResults$,
    isSearchLoading: isSearchLoading$,
    picked: picked$,
    known: known$,
    fits: fits$,
    isFitsSettling: isFitsSettling$,
    isHistoryLoading: history.pipe(map((query) => query.isLoading)),
    mixtape: mixtape.pipe(map((query) => query.data ?? EMPTY_MIXTAPE)),
    isMixtapeLoading: mixtape.pipe(
      map((query) => query.isLoading || query.isPlaceholderData),
    ),
  };
}
