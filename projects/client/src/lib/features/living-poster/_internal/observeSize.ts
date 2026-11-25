type SizeListener = (target: Element) => void;

const listeners = new Map<Element, SizeListener>();
let observer: ResizeObserver | null = null;

function sharedObserver() {
  observer ??= new ResizeObserver((entries) => {
    for (const { target } of entries) listeners.get(target)?.(target);
  });
  return observer;
}

export function observeSize(target: Element, listener: SizeListener) {
  listeners.set(target, listener);
  sharedObserver().observe(target);

  return () => {
    listeners.delete(target);
    observer?.unobserve(target);
  };
}
