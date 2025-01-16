import { useMedia, WellKnownMediaQuery } from '$lib/stores/css/useMedia';
import { onMount } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import type { TraktButtonProps } from '../TraktButtonProps';

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

  const isTouch = useMedia(WellKnownMediaQuery.touch);

  const color = writable<ButtonColor>(
    interactionToColor(get(isTouch), isActive),
  );

  onMount(() =>
    derived(
      [isTouch],
      ([$isTouch]) => interactionToColor($isTouch, isActive),
    ).subscribe(color.set)
  );

  return {
    color,
    variant: derived(
      isTouch,
      ($isTouch) => isActive && !$isTouch ? 'primary' : 'secondary',
    ),
    isTouch,
    onmouseover: () => color.set(stateToColor(isActive)),
    onfocusin: () => color.set(stateToColor(isActive)),
    onfocusout: () => color.set(interactionToColor(get(isTouch), isActive)),
    onmouseout: () => color.set(interactionToColor(get(isTouch), isActive)),
  };
}
