import { countVisibleChips } from '../countVisibleChips.ts';

const MAX_ROWS = 2;
const MORE_CHIP_WIDTH = 32;

const measurements = new WeakMap<Element, () => void>();

let sharedObserver: ResizeObserver | undefined;

function getSharedObserver(): ResizeObserver {
  sharedObserver ??= new ResizeObserver((entries) =>
    entries.forEach((entry) => measurements.get(entry.target)?.()),
  );

  return sharedObserver;
}

export function trackVisibleChips(
  node: HTMLElement,
  onChange: (count: number) => void,
) {
  const state = { isDestroyed: false };

  const measure = () => {
    if (state.isDestroyed) return;

    const widths = Array.from(
      node.querySelectorAll<HTMLElement>('[data-chip]'),
      (chip) => chip.offsetWidth,
    );

    onChange(
      countVisibleChips({
        widths,
        available: node.clientWidth,
        gap: parseFloat(getComputedStyle(node).columnGap) || 0,
        maxRows: MAX_ROWS,
        moreWidth: MORE_CHIP_WIDTH,
      }),
    );
  };

  const observer = getSharedObserver();
  measurements.set(node, measure);
  observer.observe(node);
  document.fonts?.ready.then(measure);

  return {
    destroy() {
      state.isDestroyed = true;
      observer.unobserve(node);
      measurements.delete(node);
    },
  };
}
