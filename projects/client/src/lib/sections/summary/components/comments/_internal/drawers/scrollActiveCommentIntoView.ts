import { time } from '$lib/utils/timing/time.ts';
import { animationFrames, endWith, map, takeWhile } from 'rxjs';
import { cubicOut } from 'svelte/easing';

const SCROLL_DURATION = time.seconds(0.5);

/*
  Manually scroll comment into view to account for dynamic content height changes.
*/
export function scrollActiveCommentIntoView(
  target: HTMLElement,
  containerClass: string,
) {
  const container = target.closest<HTMLElement>(`.${containerClass}`);
  if (!container) return;

  const startScrollTop = container.scrollTop;

  const scrollSubscription = animationFrames()
    .pipe(
      map(({ elapsed }) => elapsed),
      takeWhile((elapsed) => elapsed < SCROLL_DURATION),
      endWith(SCROLL_DURATION),
    )
    .subscribe({
      next: (elapsed) => {
        const progress = Math.min(elapsed / SCROLL_DURATION, 1);

        const currentTargetPosition = target.offsetTop;
        const totalDistance = currentTargetPosition - startScrollTop;

        container.scrollTop = startScrollTop +
          totalDistance * cubicOut(progress);
      },
    });

  return {
    destroy: () => {
      scrollSubscription.unsubscribe();
    },
  };
}
