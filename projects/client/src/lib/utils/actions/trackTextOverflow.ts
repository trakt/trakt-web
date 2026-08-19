import type { WritableSubject } from '$lib/utils/store/WritableSubject.ts';

export function trackTextOverflow(
  node: HTMLElement,
  isTruncated: WritableSubject<boolean>,
) {
  const measure = () =>
    isTruncated.set(
      node.scrollWidth > node.clientWidth ||
        node.scrollHeight > node.clientHeight,
    );

  node.addEventListener('pointerenter', measure);
  measure();

  return {
    destroy() {
      node.removeEventListener('pointerenter', measure);
    },
  };
}
