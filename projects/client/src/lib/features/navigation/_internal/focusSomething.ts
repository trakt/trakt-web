import { DpadNavigationType } from '../models/DpadNavigationType.ts';
import { focusAndScrollIntoView } from './focusAndScrollIntoView.ts';

export function focusSomething() {
  if (document.activeElement && document.activeElement !== document.body) {
    return;
  }

  const navigableActiveLink = document.querySelector(
    `.trakt-link-active[data-dpad-navigation="${DpadNavigationType.Item}"]`,
  );
  if (navigableActiveLink) {
    focusAndScrollIntoView(navigableActiveLink);
    return;
  }

  const firstNavigableElement = document.querySelector(
    `[data-dpad-navigation="${DpadNavigationType.Item}"]`,
  );

  focusAndScrollIntoView(firstNavigableElement);
}
