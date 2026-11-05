import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';

export function scrollbarScroll(node: HTMLElement, isEnabled = true) {
  if (!isEnabled) return {};

  const state = {
    release: undefined as (() => void) | undefined,
  };

  const handleRelease = () => {
    state.release?.();
    state.release = undefined;
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (event.target !== node) return;
    handleRelease();
    state.release = GlobalEventBus.getInstance().register(
      'mouseup',
      handleRelease,
    );
  };

  const handleScroll = () => {
    if (!state.release) return;
    node.dispatchEvent(new CustomEvent('scrollbarscroll'));
  };

  node.addEventListener('mousedown', handleMouseDown);
  node.addEventListener('scroll', handleScroll, { passive: true });

  return {
    destroy() {
      handleRelease();
      node.removeEventListener('mousedown', handleMouseDown);
      node.removeEventListener('scroll', handleScroll);
    },
  };
}
