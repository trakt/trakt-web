import { onMount } from 'svelte';
import { get, writable } from 'svelte/store';
import { focusAndScrollIntoView } from './_internal/focusAndScrollIntoView.ts';
import { DpadNavigationType } from './models/DpadNavigationType.ts';
import { useNavigation } from './useNavigation.ts';

export function navigationTrap(
  element: HTMLElement,
  itemParentSelector: string,
) {
  const { navigation } = useNavigation();
  const currentElement = writable<Element | null>(null);

  onMount(() => {
    if (get(navigation) !== 'dpad') {
      return;
    }

    currentElement.set(document.activeElement);

    element.setAttribute(
      'data-dpad-navigation',
      DpadNavigationType.Trap,
    );

    const selectableElement = element.querySelector(
      `${itemParentSelector} [data-dpad-navigation='${DpadNavigationType.Item}']`,
    );
    focusAndScrollIntoView(selectableElement);

    return () => {
      element.removeAttribute('data-dpad-navigation');
      focusAndScrollIntoView(get(currentElement));
    };
  });
}
