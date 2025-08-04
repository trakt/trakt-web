import { DpadNavigationType } from '$lib/features/navigation/models/DpadNavigationType.ts';

export const getRelevantItem = (target: Document | Element) => {
  const item = target.querySelector(
    `[data-dpad-navigation="${DpadNavigationType.List}"] [data-dpad-navigation="${DpadNavigationType.Item}"]`,
  );

  const navigableActiveLink = target.querySelector(
    `.trakt-link-active[data-dpad-navigation="${DpadNavigationType.Item}"]`,
  );

  const navbarLink = target.querySelector(
    `[data-dpad-navigation="${DpadNavigationType.Navbar}"] .trakt-button-link[data-dpad-navigation="${DpadNavigationType.Item}"]`,
  );

  return item ?? navigableActiveLink ?? navbarLink;
};
