import { GlobalEventBus } from '../events/GlobalEventBus.ts';

export type ClickOutsideEventDetail = {
  source: Node | KeyboardEvent | 'resize' | 'scroll';
};

export function clickOutside(node: HTMLElement) {
  const dispatch = (source: ClickOutsideEventDetail['source']) => {
    node.dispatchEvent(
      new CustomEvent<ClickOutsideEventDetail>('clickoutside', {
        detail: { source },
      }),
    );
  };

  function handleClick(e: MouseEvent) {
    if (!e.target) return;
    if (e.target instanceof Node && node.contains(e.target as Node)) return;

    dispatch(e.target as Node);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      dispatch(e);
    }
  }

  const instance = GlobalEventBus.getInstance();

  const destroyClick = instance.register('click', handleClick);
  const destroyResize = instance.register('resize', () => dispatch('resize'));
  const destroyScroll = instance.register('scroll', () => dispatch('scroll'));
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
