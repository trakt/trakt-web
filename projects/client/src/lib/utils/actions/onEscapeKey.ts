import { GlobalEventBus } from '../events/GlobalEventBus.ts';

export function onEscapeKey(_node: HTMLElement, onEscape: () => void) {
  let callback = onEscape;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') {
      return;
    }

    callback();
  };

  const unregister = GlobalEventBus.getInstance().register(
    'keydown',
    handleKeyDown,
  );

  return {
    update(newOnEscape: () => void) {
      callback = newOnEscape;
    },
    destroy() {
      unregister();
    },
  };
}
