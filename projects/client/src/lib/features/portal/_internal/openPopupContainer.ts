import { alignPopupContainer } from '$lib/features/portal/_internal/alignPopupContainer.ts';
import { bodyPortal } from '$lib/features/portal/_internal/bodyPortal.ts';
import { onMount } from 'svelte';

export function openPopupContainer(node: HTMLElement, targetNode: HTMLElement) {
  function moveNodeToBody() {
    const targetRect = targetNode.getBoundingClientRect();

    requestAnimationFrame(() => {
      bodyPortal(node, targetRect);
      alignPopupContainer({ popupContainer: node, targetNode, targetRect });
    });
  }

  onMount(moveNodeToBody);

  const observer = new MutationObserver(() => {
    const targetRect = targetNode.getBoundingClientRect();
    alignPopupContainer({ popupContainer: node, targetNode, targetRect });
  });

  observer.observe(node, {
    subtree: true,
    childList: true,
  });

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
