import { bodyPortal } from '$lib/features/portal/_internal/bodyPortal.ts';
import { onMount } from 'svelte';
import { TRAKT_MODAL_CLASS } from '../../../components/dialogs/constants/index.ts';
import { alignPopupContainer } from './alignPopupContainer.ts';
import type { PopupPlacement } from './models/PopupPlacement.ts';
import { resetPositionAttributes } from './resetPositionAttributes.ts';

export function openPopupContainer(
  node: HTMLElement,
  targetNode: HTMLElement,
  placement: PopupPlacement,
) {
  function moveNodeToBody() {
    const targetRect = targetNode.getBoundingClientRect();

    requestAnimationFrame(() => {
      const target = { node, targetRect, targetNode, placement };
      bodyPortal(target);
      alignPopupContainer(target);
    });
  }

  onMount(moveNodeToBody);

  const observer = new MutationObserver(() => {
    const openModal = document.querySelector(
      `.${TRAKT_MODAL_CLASS}[open]`,
    );
    if (openModal) {
      return;
    }

    const targetRect = targetNode.getBoundingClientRect();
    alignPopupContainer({ node, targetRect, targetNode, placement });
  });

  observer.observe(node, {
    subtree: true,
    childList: true,
  });

  return {
    destroy() {
      resetPositionAttributes(targetNode);
      observer.disconnect();
    },
  };
}
