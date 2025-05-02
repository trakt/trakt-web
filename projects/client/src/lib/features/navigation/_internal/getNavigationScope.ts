import { DpadNavigationType } from '../models/DpadNavigationType.ts';

export function getNavigationScope() {
  const navigationTrap = document.querySelector(
    `[data-dpad-navigation="${DpadNavigationType.Trap}"]`,
  );

  return navigationTrap ?? document;
}
