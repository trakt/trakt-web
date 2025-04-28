import { useNavigation } from '$lib/features/navigation/useNavigation.ts';
import { onMount } from 'svelte';
import { get } from 'svelte/store';

export function dPadTrigger(
  element: HTMLElement,
  targetSelector: string,
) {
  const { navigation } = useNavigation();

  const handler = (event: KeyboardEvent) => {
    if (event.key !== 'Enter') {
      return;
    }

    const link = element.querySelector(targetSelector);
    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }

    link.click();
  };

  onMount(() => {
    if (get(navigation) !== 'dpad') {
      return;
    }

    element.setAttribute('tabindex', '0');
    element.setAttribute('role', 'button');
    element.addEventListener('keydown', handler);

    return () => {
      element.removeEventListener('keydown', handler);
    };
  });
}
