import { alignPopupContainer } from '$lib/components/buttons/popup/_internal/alignPopupContainer.ts';
import { onMount } from 'svelte';

export function bodyPortal(
  node: HTMLElement,
  targetNode: HTMLElement,
) {
  function moveNodeToBody() {
    const targetRect = targetNode.getBoundingClientRect();

    requestAnimationFrame(() => {
      document.body.appendChild(node);
      node.setAttribute('data-popup-direction', 'right');

      node.style.position = 'absolute';
      node.style.left = `${globalThis.window.scrollX + targetRect.left}px`;
      node.style.top = `${globalThis.window.scrollY + targetRect.top}px`;

      alignPopupContainer(node, targetRect);
    });
  }

  onMount(moveNodeToBody);

  const observer = new MutationObserver(() => {
    const targetRect = targetNode.getBoundingClientRect();
    alignPopupContainer(node, targetRect);
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
