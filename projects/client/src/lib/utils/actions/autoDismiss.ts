import { time } from '$lib/utils/timing/time.ts';
import { interval, type Subscription } from 'rxjs';

const defaultDuration = time.seconds(10);
const fps = 30;

export type AutoDismissProps = {
  onDismiss: () => void;
  durationMs?: number;
  now?: () => number;
  persistent?: boolean;
};

export function autoDismiss(
  node: HTMLElement,
  {
    onDismiss,
    durationMs = defaultDuration,
    now = Date.now,
    persistent = false,
  }: AutoDismissProps,
) {
  let params = { onDismiss, durationMs, now, persistent };
  let subscription: Subscription | null = null;

  const stop = () => {
    subscription?.unsubscribe();
    subscription = null;
    node.style.removeProperty('--progress');
  };

  const start = () => {
    if (subscription) {
      return;
    }

    const startTime = params.now();
    node.style.setProperty('--progress', '0');

    subscription = interval(time.fps(fps)).subscribe(() => {
      const elapsedMs = params.now() - startTime;
      const progress = Math.min(elapsedMs / params.durationMs, 1);

      node.style.setProperty('--progress', String(progress));

      if (progress >= 1) {
        stop();
        params.onDismiss();
      }
    });
  };

  const sync = () => (params.persistent ? stop() : start());

  sync();

  return {
    update(newParams: AutoDismissProps) {
      params = {
        onDismiss: newParams.onDismiss,
        durationMs: newParams.durationMs ?? params.durationMs,
        now: newParams.now ?? params.now,
        persistent: newParams.persistent ?? params.persistent,
      };

      sync();
    },
    destroy() {
      stop();
    },
  };
}
