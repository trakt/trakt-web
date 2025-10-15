import { createUnderlay } from '$lib/features/portal/_internal/createUnderlay.ts';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
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

      const instance = GlobalEventBus.getInstance();
      const newUnderlay = createUnderlay();

      document.body.appendChild(newUnderlay);
      document.body.appendChild(element);

      newUnderlay.addEventListener('click', onClose);
      const destroyScroll = instance.register('scroll', onClose);

      return () => {
        newUnderlay.removeEventListener('click', onClose);
        destroyScroll();
        newUnderlay.remove();
        element.remove();
      };
    });
  };

  return { portal };
}
