import { useMedia, WellKnownMediaQuery } from '$lib/stores/css/useMedia';
import { onMount } from 'svelte';
import { derived, get, writable } from 'svelte/store';

type DangerProps = {
  isActive: boolean;
};
export function useDangerColor({
  isActive,
}: DangerProps) {
  const stateToColor = (isActive: boolean) => (isActive ? 'red' : 'purple');
  const interactionToColor = (isTouch: boolean, isActive: boolean) =>
    isTouch ? stateToColor(isActive) : 'purple';

  const isTouch = useMedia(WellKnownMediaQuery.touch);

  const color = writable<'purple' | 'red'>(
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
    onmouseover: () => color.set(stateToColor(isActive)),
    onfocusin: () => color.set(stateToColor(isActive)),
    onfocusout: () => color.set(interactionToColor(get(isTouch), isActive)),
    onmouseout: () => color.set(interactionToColor(get(isTouch), isActive)),
  };
}
