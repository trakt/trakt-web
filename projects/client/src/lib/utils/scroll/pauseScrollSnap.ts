const holders = new WeakMap<HTMLElement, Set<symbol>>();

export function pauseScrollSnap(node: HTMLElement) {
  const token = Symbol('scroll-snap-hold');
  const active = holders.get(node) ?? new Set<symbol>();

  holders.set(node, active);
  active.add(token);
  node.style.scrollSnapType = 'none';

  return () => {
    if (!active.delete(token)) return;
    if (active.size > 0) return;

    node.style.scrollSnapType = '';
  };
}
