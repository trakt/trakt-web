import { BehaviorSubject } from 'rxjs';
import { onMount } from 'svelte';
import { focusAndScrollIntoView } from './_internal/focusAndScrollIntoView.ts';
import { DpadNavigationType } from './models/DpadNavigationType.ts';
import { useNavigation } from './useNavigation.ts';

export function navigationTrap(
  element: HTMLElement,
  itemParentSelector: string,
) {
  const { navigation } = useNavigation();
  const currentElement = new BehaviorSubject<Element | null>(null);

  onMount(() => {
    let isDpad = false;
    const navSub = navigation.subscribe((v) => (isDpad = v === 'dpad'));
    navSub.unsubscribe();

    if (!isDpad) {
      return;
    }

    currentElement.next(document.activeElement);

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
      focusAndScrollIntoView(currentElement.value);
    };
  });
}
