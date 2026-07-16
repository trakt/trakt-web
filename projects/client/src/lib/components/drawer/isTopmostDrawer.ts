const DRAWER_SELECTOR = '.trakt-drawer';

const zIndexOf = (drawer: HTMLElement) =>
  Number.parseInt(getComputedStyle(drawer).zIndex, 10) || 0;

/**
 * Whether the drawer containing `element` is the topmost drawer on screen.
 *
 * Drawers portal to `document.body`; stacked (elevated) drawers sit at a higher
 * z-index than the base drawer, so window-level shortcuts can ask this at event
 * time instead of threading an "is something stacked on me" flag down as a prop.
 *
 * FIXME: remove once we eliminate drawer-in-drawer in the episode drawer.
 */
export function isTopmostDrawer(element: HTMLElement): boolean {
  const ownDrawer = element.closest<HTMLElement>(DRAWER_SELECTOR);
  if (!ownDrawer) {
    return false;
  }

  const drawers = document.querySelectorAll<HTMLElement>(DRAWER_SELECTOR);
  const topZIndex = Math.max(...Array.from(drawers, zIndexOf));

  return zIndexOf(ownDrawer) >= topZIndex;
}
