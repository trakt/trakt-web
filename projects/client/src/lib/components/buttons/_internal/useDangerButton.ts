import { useMedia, WellKnownMediaQuery } from '$lib/stores/css/useMedia.ts';
import { BehaviorSubject, combineLatest, distinctUntilChanged } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { time } from '../../../utils/timing/time.ts';
import type { TraktButtonProps } from '../TraktButtonProps.ts';

type ButtonColor = Exclude<TraktButtonProps['color'], Nil>;
type DangerProps = {
  color: ButtonColor;
  isActive: boolean;
};
export function useDangerButton({
  color: seed,
  isActive,
}: DangerProps) {
  const stateToColor = (isActive: boolean) => (isActive ? 'red' : seed);
  const interactionToColor = (isTouch: boolean, isActive: boolean) =>
    isTouch ? stateToColor(isActive) : seed;

  const isTouch$ = useMedia(WellKnownMediaQuery.touch);

  const activeColor$ = new BehaviorSubject<ButtonColor | null>(null);

  const color$ = combineLatest([isTouch$, activeColor$]).pipe(
    map(([isTouch, activeColor]) =>
      activeColor ?? interactionToColor(isTouch, isActive)
    ),
  );

  const variant$ = isTouch$.pipe(
    map((isTouch) => isActive && !isTouch ? 'primary' : 'secondary'),
  );

  return {
    color: color$.pipe(
      debounceTime(time.fps(60)),
      distinctUntilChanged(),
    ),
    variant: variant$,
    isTouch: isTouch$,
    onmouseover: () => activeColor$.next(stateToColor(isActive)),
    onfocusin: () => activeColor$.next(stateToColor(isActive)),
    onfocusout: () => activeColor$.next(null),
    onmouseout: () => activeColor$.next(null),
  };
}
