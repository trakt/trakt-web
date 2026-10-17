import type { WritableSubject } from '$lib/utils/store/WritableSubject.ts';

const pending = new Map<HTMLElement, WritableSubject<boolean>>();
let frame: number | null = null;

function isOverflowing(node: HTMLElement) {
  return (
    node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight
  );
}

function flushPending() {
  frame = null;
  const measured = [...pending].map(([node, isTruncated]) => ({
    isTruncated,
    value: isOverflowing(node),
  }));
  pending.clear();

  measured.forEach(({ isTruncated, value }) => isTruncated.set(value));
}

export function trackTextOverflow(
  node: HTMLElement,
  isTruncated: WritableSubject<boolean>,
) {
  const measure = () => isTruncated.set(isOverflowing(node));

  node.addEventListener('pointerenter', measure);

  frame ??= requestAnimationFrame(flushPending);
  pending.set(node, isTruncated);

  return {
    destroy() {
      node.removeEventListener('pointerenter', measure);
      pending.delete(node);
      if (pending.size > 0 || frame === null) return;

      cancelAnimationFrame(frame);
      frame = null;
    },
  };
}
