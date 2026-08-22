import { time } from '$lib/utils/timing/time.ts';
import { interval } from 'rxjs';

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
  const startTime = now();

  const subscription = persistent
    ? null
    : interval(time.fps(fps)).subscribe(() => {
      if (params.persistent) {
        return;
      }

      const elapsedMs = params.now() - startTime;
      const progress = Math.min(elapsedMs / params.durationMs, 1);

      node.style.setProperty('--progress', String(progress));

      if (progress >= 1) {
        subscription?.unsubscribe();
        params.onDismiss();
      }
    });

  return {
    update(newParams: AutoDismissProps) {
      params = {
        onDismiss: newParams.onDismiss,
        durationMs: newParams.durationMs ?? params.durationMs,
        now: newParams.now ?? params.now,
        persistent: newParams.persistent ?? params.persistent,
      };
    },
    destroy() {
      subscription?.unsubscribe();
    },
  };
}
