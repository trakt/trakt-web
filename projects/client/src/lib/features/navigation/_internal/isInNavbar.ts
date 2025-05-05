import { DpadNavigationType } from '../models/DpadNavigationType.ts';

export function isInNavbar() {
  return Boolean(
    document.activeElement?.closest(
      `[data-dpad-navigation="${DpadNavigationType.Navbar}"]`,
    ),
  );
}
