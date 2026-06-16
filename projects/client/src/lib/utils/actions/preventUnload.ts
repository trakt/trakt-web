import { GlobalEventBus } from '../events/GlobalEventBus.ts';

export function preventUnload(_node: HTMLElement, isActive: boolean) {
  const unregister = GlobalEventBus.getInstance().register(
    'beforeunload',
    (event) => {
      if (!isActive) return;
      event.preventDefault();
      event.returnValue = '';
    },
  );

  return {
    update(next: boolean) {
      isActive = next;
    },
    destroy() {
      unregister();
    },
  };
}
