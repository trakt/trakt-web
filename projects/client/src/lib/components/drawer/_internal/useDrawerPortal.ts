import { createUnderlay } from '$lib/features/portal/_internal/createUnderlay.ts';
import { onMount } from 'svelte';

type DrawerPortalProps = {
  hasAutoClose: boolean;
  onClose: () => void;
};

export function useDrawerPortal({ hasAutoClose, onClose }: DrawerPortalProps) {
  const portal = (element: HTMLElement) => {
    onMount(() => {
      if (!hasAutoClose) {
        return;
      }

      const newUnderlay = createUnderlay();

      document.body.appendChild(newUnderlay);
      document.body.appendChild(element);

      newUnderlay.addEventListener('click', onClose);

      return () => {
        newUnderlay.removeEventListener('click', onClose);
        newUnderlay.remove();
        element.remove();
      };
    });
  };

  return { portal };
}
