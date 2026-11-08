import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { Season } from '$lib/requests/models/Season.ts';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  type Observable,
} from 'rxjs';
import { toCaughtUpSeason } from './toCaughtUpSeason.ts';

type CaughtUpSeasonTarget = {
  showId: number;
  seasons: ReadonlyArray<Pick<Season, 'number' | 'episodes'>>;
};

export function useCaughtUpSeason(target$: Observable<CaughtUpSeasonTarget>) {
  const { history } = useUser();

  return combineLatest([target$, history]).pipe(
    map(([{ showId, seasons }, $history]) =>
      $history
        ? toCaughtUpSeason({
            seasons,
            watchedPerSeason:
              $history.shows.get(showId)?.playsPerSeason ?? new Map(),
          })
        : null,
    ),
    distinctUntilChanged(),
  );
}
