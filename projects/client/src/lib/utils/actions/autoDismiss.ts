import { time } from '$lib/utils/timing/time.ts';
import { interval } from 'rxjs';

const FPS = 30;

export type AutoDismissProps = {
  onDismiss: () => void;
  durationSeconds?: number;
  now?: () => number;
};

export function autoDismiss(
  node: HTMLElement,
  { onDismiss, durationSeconds = 10, now = Date.now }: AutoDismissProps,
) {
  const startTime = now();
  const durationMs = durationSeconds * 1000;

  const subscription = interval(time.fps(FPS)).subscribe(() => {
    const elapsedMs = now() - startTime;
    const progress = Math.min(elapsedMs / durationMs, 1);

    node.style.setProperty('--progress', String(progress));

    if (progress >= 1) {
      subscription.unsubscribe();
      onDismiss();
    }
  });

  return {
    destroy() {
      subscription.unsubscribe();
    },
  };
}
