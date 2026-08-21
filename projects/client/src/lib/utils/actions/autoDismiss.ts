import { time } from '$lib/utils/timing/time.ts';
import { interval } from 'rxjs';

const defaultDuration = time.seconds(10);
const fps = 30;

export type AutoDismissProps = {
  onDismiss: () => void;
  durationMs?: number;
  now?: () => number;
  /** Restarts the countdown whenever the value changes. */
  resetKey?: unknown;
};

export function autoDismiss(
  node: HTMLElement,
  {
    onDismiss,
    durationMs = defaultDuration,
    now = Date.now,
    resetKey,
  }: AutoDismissProps,
) {
  let params = { onDismiss, durationMs, now, resetKey };
  let startTime = now();
  let hasDismissed = false;

  const subscription = interval(time.fps(fps)).subscribe(() => {
    if (hasDismissed) {
      return;
    }

    const elapsedMs = params.now() - startTime;
    const progress = Math.min(elapsedMs / params.durationMs, 1);

    node.style.setProperty('--progress', String(progress));

    if (progress >= 1) {
      hasDismissed = true;
      params.onDismiss();
    }
  });

  return {
    update(newParams: AutoDismissProps) {
      const hasReset = newParams.resetKey !== params.resetKey;

      params = {
        onDismiss: newParams.onDismiss,
        durationMs: newParams.durationMs ?? params.durationMs,
        now: newParams.now ?? params.now,
        resetKey: newParams.resetKey,
      };

      if (hasReset) {
        startTime = params.now();
        hasDismissed = false;
      }
    },
    destroy() {
      subscription.unsubscribe();
    },
  };
}
