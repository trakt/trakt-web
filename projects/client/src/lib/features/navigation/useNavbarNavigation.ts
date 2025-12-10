import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { BehaviorSubject } from 'rxjs';
import { focusAndScrollIntoView } from './_internal/focusAndScrollIntoView.ts';
import { focusElement } from './_internal/focusElement.ts';
import { getRelevantItem } from './_internal/getRelevantItem.ts';
import { DpadNavigationType } from './models/DpadNavigationType.ts';

function getItemInView() {
  const items = Array.from(document.querySelectorAll(
    `[data-dpad-navigation="${DpadNavigationType.List}"] [data-dpad-navigation="${DpadNavigationType.Item}"]`,
  ));

  const item = items.find((item) => {
    const rect = item.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= globalThis.window.innerHeight &&
      rect.right <= globalThis.window.innerWidth
    );
  });

  return item ?? items.at(0);
}

export function useNavbarNavigation() {
  const outsideElement = new BehaviorSubject<Element | null>(null);
  const navbarElement = new BehaviorSubject<Element | null>(null);

  const leaveNavbar = () => {
    navbarElement.next(document.activeElement);
    focusElement(outsideElement.value ?? getItemInView());
    outsideElement.next(null);
  };

  const enterNavbar = () => {
    outsideElement.next(document.activeElement);

    const navbar = assertDefined(
      document.querySelector(
        `[data-dpad-navigation="${DpadNavigationType.Navbar}"]`,
      ),
      'No navbar was found',
    );

    focusAndScrollIntoView(navbarElement.value ?? getRelevantItem(navbar));
    navbarElement.next(null);
  };

  return {
    leaveNavbar,
    enterNavbar,
    reset: () => {
      outsideElement.next(null);
      navbarElement.next(null);
    },
  };
}
