import { time } from '$lib/utils/timing/time.ts';
import { BehaviorSubject, interval, takeWhile } from 'rxjs';

const FPS = 30;
const DURATION_SECONDS = 10;

type AutoDismissProps = {
  onDismiss: () => void;
};

export function autoDismiss(
  node: HTMLElement,
  { onDismiss }: AutoDismissProps,
) {
  const remainingSeconds = new BehaviorSubject<number>(DURATION_SECONDS);

  const timerSubscription = interval(time.fps(FPS))
    .pipe(takeWhile(() => remainingSeconds.getValue() > 0))
    .subscribe(() => {
      const nextValue = Math.max(
        remainingSeconds.getValue() - 1 / FPS,
        0,
      );
      remainingSeconds.next(nextValue);
    });

  const dismissSubscription = remainingSeconds.subscribe((value) => {
    if (value > 0) {
      node.style.setProperty(
        '--progress',
        String(1 - value / DURATION_SECONDS),
      );
      return;
    }

    onDismiss();
  });

  return {
    destroy() {
      timerSubscription.unsubscribe();
      dismissSubscription.unsubscribe();
    },
  };
}
