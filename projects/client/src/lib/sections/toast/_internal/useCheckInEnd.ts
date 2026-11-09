import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { filter, map, type Observable, pairwise } from 'rxjs';

const isPresent = (item: NowPlayingItem | null): item is NowPlayingItem =>
  item != null;

export function useCheckInEnd() {
  const { invalidate } = useInvalidator();

  const refreshHistoryOnEnd = (nowPlaying: Observable<NowPlayingItem | null>) =>
    nowPlaying
      .pipe(
        pairwise(),
        map(([previous, current]) => (current == null ? previous : null)),
        filter(isPresent),
      )
      .subscribe((item) =>
        invalidate(InvalidateAction.MarkAsWatched(item.type)),
      );

  return { refreshHistoryOnEnd };
}
