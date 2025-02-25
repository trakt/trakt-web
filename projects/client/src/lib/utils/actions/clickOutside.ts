import { GlobalEventBus } from '../events/GlobalEventBus.ts';

export function clickOutside(node: HTMLElement) {
  const dispatch = () => node.dispatchEvent(new CustomEvent('clickoutside'));

  function handleClick(e: MouseEvent) {
    if (!e.target) return;
    if (e.target instanceof Node && node.contains(e.target as Node)) return;

    dispatch();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      dispatch();
    }
  }

  const instance = GlobalEventBus.getInstance();

  const destroyClick = instance.register('click', handleClick);
  const destroyResize = instance.register('resize', dispatch);
  const destroyScroll = instance.register('scroll', dispatch);
  const destroyKeyPress = instance.register('keydown', handleKeyDown);

  return {
    destroy() {
      destroyClick();
      destroyResize();
      destroyScroll();
      destroyKeyPress();
    },
  };
}
