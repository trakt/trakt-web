import { merge, type Observable } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';

type ScrubSources = {
  down$: Observable<PointerEvent>;
  move$: Observable<PointerEvent>;
  up$: Observable<PointerEvent>;
  cancel$: Observable<PointerEvent>;
  leave$: Observable<PointerEvent>;
};

type ScrubCommit = {
  down: PointerEvent;
  up: PointerEvent;
};

type ScrubInteraction = {
  // clientX while scrubbing; null once the pointer leaves or the gesture is
  // cancelled.
  preview$: Observable<number | null>;
  // One emission per completed scrub: the press paired with the release that
  // ended it.
  commit$: Observable<ScrubCommit>;
};

// Pure stream wiring for the scrub-to-rate gesture, decoupled from the DOM so it
// can be marble-tested. Each pointerdown owns the pointerup that ends it; a
// pointercancel aborts the gesture without committing.
export function createScrubInteraction(
  { down$, move$, up$, cancel$, leave$ }: ScrubSources,
): ScrubInteraction {
  const preview$ = merge(
    move$.pipe(map((event) => event.clientX as number | null)),
    merge(leave$, cancel$).pipe(map(() => null)),
  );

  const commit$ = down$.pipe(
    switchMap((down) =>
      up$.pipe(
        takeUntil(cancel$),
        take(1),
        map((up) => ({ down, up })),
      )
    ),
  );

  return { preview$, commit$ };
}
