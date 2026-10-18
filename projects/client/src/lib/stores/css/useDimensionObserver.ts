import { debounce } from '$lib/utils/timing/debounce.ts';
import { BehaviorSubject } from 'rxjs';
export type Dimension = 'width' | 'height' | 'bottom';

// Extract dimension getter function
const getDimension = (node: HTMLElement, dimension: Dimension): number => {
  return node.getBoundingClientRect()[dimension];
};

// Extract dimension setter function
const setObservedDimension = (
  node: HTMLElement,
  dimension: Dimension,
  store: BehaviorSubject<number>,
): void => {
  const newValue = getDimension(node, dimension);

  if (store.value !== newValue) {
    store.next(newValue);
  }
};

export const useDimensionObserver = (
  dimension: Dimension,
  debounceMs?: number,
) => {
  const observedDimension = new BehaviorSubject(0);

  const observeDimension = (node: HTMLElement) => {
    const update = () =>
      setObservedDimension(node, dimension, observedDimension);
    const debouncedUpdate =
      debounceMs != null ? debounce(update, debounceMs) : update;

    // Initial size
    update();

    // Resize observer for explicit size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === node) {
          debouncedUpdate();
        }
      }
    });

    resizeObserver.observe(node);

    return {
      destroy() {
        resizeObserver.disconnect();
      },
    };
  };

  return {
    observedDimension,
    observeDimension,
  };
};
