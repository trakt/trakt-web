import type { ClickOutsideEventDetail } from '$lib/utils/actions/clickOutside.ts';

export function isTargetContained(container: HTMLElement | null, event: Event) {
  const closeEvent = event as CustomEvent<ClickOutsideEventDetail>;
  const isNodeSource = closeEvent.detail.source instanceof Node;

  if (!isNodeSource) {
    return false;
  }

  return container?.contains(
    closeEvent.detail.source as Node,
  );
}
