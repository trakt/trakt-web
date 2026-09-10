import { afterNavigate } from '$app/navigation';
import { page } from '$app/state';
import { createUnderlay } from '$lib/features/portal/_internal/createUnderlay.ts';
import { onMount } from 'svelte';

type DrawerPortalProps = {
  hasAutoClose: boolean;
  onClose: () => void;
  elevated?: boolean;
};

export function useDrawerPortal(
  { hasAutoClose, onClose, elevated }: DrawerPortalProps,
) {
  const portal = (element: HTMLElement) => {
    // The route the drawer was opened on. When a cached page mounts the drawer
    // synchronously during the arriving navigation, afterNavigate would fire
    // for that same navigation and close it immediately. Only auto-close when
    // navigating AWAY from this route, not when arriving at it.
    const ownRouteId = page.route.id;

    onMount(() => {
      const underlay = hasAutoClose ? createUnderlay({ elevated }) : null;

      if (underlay) {
        document.body.appendChild(underlay);
        underlay.addEventListener('click', onClose);
      }

      document.body.appendChild(element);

      return () => {
        underlay?.removeEventListener('click', onClose);
        underlay?.remove();
        element.remove();
      };
    });

    afterNavigate((navigation) => {
      const leftOwnRoute = navigation.to?.route.id !== ownRouteId;
      if (hasAutoClose && leftOwnRoute) {
        onClose();
      }
    });
  };

  return { portal };
}
