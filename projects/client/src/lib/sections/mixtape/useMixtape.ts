import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { mixtapeHistoryQuery } from '$lib/requests/queries/mixtape/mixtapeHistoryQuery.ts';
import type { Mixtape } from '$lib/requests/models/Mixtape.ts';
import { mixtapePicksQuery } from '$lib/requests/queries/mixtape/mixtapePicksQuery.ts';
import { mixtapeQuery } from '$lib/requests/queries/mixtape/mixtapeQuery.ts';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  type Observable,
} from 'rxjs';

type MixtapeRequest = {
  type: MediaType;
  picks: number[];
};

const EMPTY_MIXTAPE: Mixtape = { fits: [], suggestions: [] };

export function useMixtape(request$: Observable<MixtapeRequest>) {
  const type$ = request$.pipe(
    map(({ type }) => type),
    distinctUntilChanged(),
  );
  const history = useQuery(
    type$.pipe(map((type) => mixtapeHistoryQuery({ type }))),
  );
  const history$ = history.pipe(map((query) => query.data ?? []));

  const mixtape = useQuery(
    combineLatest([request$, history$]).pipe(
      map(([{ type, picks }, items]) =>
        mixtapeQuery({
          type,
          picks,
          candidates: items.map(({ id }) => id),
        })
      ),
    ),
  );

  const missingPicks = useQuery(
    combineLatest([request$, history$]).pipe(
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
    history$,
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
    picked: picked$,
    isHistoryLoading: history.pipe(map((query) => query.isLoading)),
    mixtape: mixtape.pipe(map((query) => query.data ?? EMPTY_MIXTAPE)),
    isMixtapeLoading: mixtape.pipe(map((query) => query.isLoading)),
  };
}
