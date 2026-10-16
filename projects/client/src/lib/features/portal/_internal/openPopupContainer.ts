import { bodyPortal } from '$lib/features/portal/_internal/bodyPortal.ts';
import { onMount } from 'svelte';
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

  let realignFrame: number | null = null;

  const realign = () => {
    realignFrame = null;
    const targetRect = targetNode.getBoundingClientRect();
    alignPopupContainer({ node, targetRect, targetNode, placement });
  };

  const observer = new MutationObserver(() => {
    if (realignFrame != null) {
      return;
    }

    realignFrame = requestAnimationFrame(realign);
  });

  observer.observe(node, {
    subtree: true,
    childList: true,
  });

  return {
    destroy() {
      if (realignFrame != null) {
        cancelAnimationFrame(realignFrame);
      }

      resetPositionAttributes(targetNode);
      observer.disconnect();
    },
  };
}
