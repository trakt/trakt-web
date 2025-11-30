import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
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

  const activeColor$ = new BehaviorSubject<ButtonColor | null>(null);

  const color$ = activeColor$.pipe(
    map((activeColor) => activeColor ?? seed),
  );

  const variant = isActive ? 'primary' : 'secondary';

  return {
    color: color$.pipe(
      debounceTime(time.fps(60)),
      distinctUntilChanged(),
    ),
    variant,
    onmouseover: () => activeColor$.next(stateToColor(isActive)),
    onfocusin: () => activeColor$.next(stateToColor(isActive)),
    onfocusout: () => activeColor$.next(null),
    onmouseout: () => activeColor$.next(null),
  };
}
