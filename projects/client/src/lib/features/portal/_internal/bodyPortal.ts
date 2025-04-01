import { onMount } from 'svelte';
import { alignPopupContainer } from './alignPopupContainer.ts';

export function bodyPortal(
  node: HTMLElement,
  targetNode: HTMLElement,
) {
  function moveNodeToBody() {
    const targetRect = targetNode.getBoundingClientRect();

    requestAnimationFrame(() => {
      document.body.appendChild(node);
      targetNode.setAttribute('data-popup-direction', 'right');

      node.style.position = 'absolute';
      node.style.left = `${globalThis.window.scrollX + targetRect.left}px`;
      node.style.top = `${globalThis.window.scrollY + targetRect.top}px`;
      node.style.zIndex = 'var(--layer-menu)';

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
