import { DpadNavigationType } from '$lib/features/navigation/models/DpadNavigationType.ts';

export const getRelevantItem = (target: Document | Element) => {
  const navigableActiveLink = target.querySelector(
    `.trakt-link-active[data-dpad-navigation="${DpadNavigationType.Item}"]`,
  );

  const navbarLink = target.querySelector(
    `[data-dpad-navigation="${DpadNavigationType.Navbar}"] .trakt-link[data-dpad-navigation="${DpadNavigationType.Item}"]`,
  );

  const item = target.querySelector(
    `[data-dpad-navigation="${DpadNavigationType.Item}"]`,
  );

  return navigableActiveLink ?? navbarLink ?? item;
};
