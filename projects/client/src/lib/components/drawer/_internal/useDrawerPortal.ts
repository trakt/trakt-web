import { afterNavigate } from '$app/navigation';
import { page } from '$app/state';
import { createUnderlay } from '$lib/features/portal/_internal/createUnderlay.ts';
import { onMount } from 'svelte';

type DrawerPortalProps = {
  getHasAutoClose: () => boolean;
  getOnClose: () => () => void;
  getElevated: () => boolean;
};

export function useDrawerPortal(
  { getHasAutoClose, getOnClose, getElevated }: DrawerPortalProps,
) {
  const portal = (element: HTMLElement, initiallyCentered: boolean) => {
    // The route the drawer was opened on. When a cached page mounts the drawer
    // synchronously during the arriving navigation, afterNavigate would fire
    // for that same navigation and close it immediately. Only auto-close when
    // navigating AWAY from this route, not when arriving at it.
    const ownRouteId = page.route.id;
    const origin = document.createComment('drawer-portal-origin');
    let centered = initiallyCentered;
    let isMounted = false;
    let isPortaled = false;
    let underlay: HTMLDivElement | undefined;
    let underlayClickHandler: (() => void) | undefined;

    const removeUnderlayClickHandler = () => {
      if (!underlay || !underlayClickHandler) return;

      underlay.removeEventListener('click', underlayClickHandler);
      underlayClickHandler = undefined;
    };

    const removeUnderlay = () => {
      removeUnderlayClickHandler();
      underlay?.remove();
      underlay = undefined;
    };

    const updateUnderlayAppearance = () => {
      if (!underlay) return;

      if (centered) {
        underlay.dataset.appearance = 'translucent';
        return;
      }

      underlay.removeAttribute('data-appearance');
    };

    const reconcileUnderlayClickHandler = () => {
      if (!underlay) return;

      const hasAutoClose = getHasAutoClose();
      const onClose = getOnClose();
      if (!hasAutoClose) {
        removeUnderlayClickHandler();
        return;
      }

      if (underlayClickHandler === onClose) return;

      removeUnderlayClickHandler();
      underlay.addEventListener('click', onClose);
      underlayClickHandler = onClose;
    };

    const reconcileUnderlay = () => {
      if (!isMounted) return;

      const needsUnderlay = getHasAutoClose() || centered;
      if (!needsUnderlay) {
        removeUnderlay();
        return;
      }

      if (!underlay) {
        underlay = createUnderlay({
          elevated: getElevated(),
          appearance: centered ? 'translucent' : undefined,
        });

        document.body.insertBefore(underlay, element);
      }

      updateUnderlayAppearance();
      reconcileUnderlayClickHandler();
    };

    onMount(() => {
      element.before(origin);
      document.body.appendChild(element);
      isPortaled = true;
      isMounted = true;
      reconcileUnderlay();

      return () => {
        isMounted = false;
        removeUnderlay();
        if (isPortaled) element.remove();
        origin.remove();
      };
    });

    afterNavigate((navigation) => {
      const leftOwnRoute = navigation.to?.route.id !== ownRouteId;
      if (getHasAutoClose() && leftOwnRoute) {
        getOnClose()();
      }
    });

    return {
      update(nextCentered: boolean) {
        centered = nextCentered;
        reconcileUnderlay();
      },
    };
  };

  return { portal };
}
