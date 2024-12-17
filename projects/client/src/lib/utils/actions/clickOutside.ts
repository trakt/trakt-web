import { GlobalEventBus } from '../events/GlobalEventBus.ts';

export function clickOutside(node: HTMLElement) {
  function handleClick(e: MouseEvent) {
    if (!e.target) return;
    if (e.target instanceof Node && node.contains(e.target as Node)) return;

    node.dispatchEvent(new CustomEvent('clickoutside'));
  }

  const destroy = GlobalEventBus
    .getInstance()
    .register('click', handleClick);

  return {
    destroy,
  };
}
