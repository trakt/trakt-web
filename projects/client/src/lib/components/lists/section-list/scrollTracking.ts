import { type Writable } from 'svelte/store';

type ScrollX = { left: number; right: number };

function extractScrollX(node: HTMLElement): ScrollX {
  const { scrollLeft, scrollWidth, clientWidth } = node;
  const left = scrollLeft;

  // Rounded up because the value can be subpixel precise
  const roundedLeft = Math.ceil(left + 0.5);
  const right = scrollWidth - clientWidth - roundedLeft;

  return { left, right };
}

export function scrollTracking(
  node: HTMLElement,
  output: Writable<ScrollX>,
) {
  function update(node: HTMLElement) {
    requestAnimationFrame(() => {
      output.set(extractScrollX(node));
    });
  }

  function watch(node: HTMLElement) {
    const handler = () => update(node);
    node.addEventListener('scroll', handler);

    const contentObserver = new MutationObserver(handler);
    contentObserver.observe(node, { childList: true });

    const resizeObserver = new ResizeObserver(handler);
    resizeObserver.observe(node);

    update(node);

    return () => {
      node.removeEventListener('scroll', handler);
      contentObserver.disconnect();
      resizeObserver.disconnect();
    };
  }

  const destroy = watch(node);

  return {
    update: () => update(node),
    destroy,
  };
}
