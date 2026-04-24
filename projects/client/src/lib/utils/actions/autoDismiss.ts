import { time } from '$lib/utils/timing/time.ts';
import { interval } from 'rxjs';

const defaultDuration = time.seconds(10);
const fps = 30;

export type AutoDismissProps = {
  onDismiss: () => void;
  durationMs?: number;
  now?: () => number;
};

export function autoDismiss(
  node: HTMLElement,
  { onDismiss, durationMs = defaultDuration, now = Date.now }: AutoDismissProps,
) {
  let params = { onDismiss, durationMs, now };
  const startTime = now();

  const subscription = interval(time.fps(fps)).subscribe(() => {
    const elapsedMs = params.now() - startTime;
    const progress = Math.min(elapsedMs / params.durationMs, 1);

    node.style.setProperty('--progress', String(progress));

    if (progress >= 1) {
      subscription.unsubscribe();
      params.onDismiss();
    }
  });

  return {
    update(newParams: AutoDismissProps) {
      params = {
        onDismiss: newParams.onDismiss,
        durationMs: newParams.durationMs ?? params.durationMs,
        now: newParams.now ?? params.now,
      };
    },
    destroy() {
      subscription.unsubscribe();
    },
  };
}
