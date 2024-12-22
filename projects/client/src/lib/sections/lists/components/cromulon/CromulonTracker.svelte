<script lang="ts">
  import { GlobalEventBus } from "$lib/utils/events/GlobalEventBus";
  import type { CromulonState } from "./CromulonState";

  const { onObserve }: { onObserve: (state: CromulonState) => void } = $props();

  // More efficient to compare squared distances than to calculate square roots
  const proximityDistance = 85 ** 2;

  function findButtonSibling(node: HTMLElement) {
    let current: HTMLElement | null = node;

    while (current) {
      const previous = current.previousElementSibling;
      const next = current.nextElementSibling;

      if (
        previous?.classList.contains("trakt-button") &&
        previous instanceof HTMLElement
      ) {
        return previous;
      }

      if (
        next?.classList.contains("trakt-button") &&
        next instanceof HTMLElement
      ) {
        return next;
      }

      current = current.parentElement;
    }

    return node;
  }

  function getCenter(node: HTMLElement) {
    const { x, y, width, height } = getBounds(node);
    return { x: x + width / 2, y: y + height / 2 };
  }

  function getBounds(node: HTMLElement) {
    const { x, y, width, height } = node.getBoundingClientRect();
    return { x, y, width, height };
  }

  function isIntersecting(node: HTMLElement, ev: MouseEvent) {
    const { x, y, width, height } = getBounds(node);
    return (
      ev.clientX >= x &&
      ev.clientX <= x + width &&
      ev.clientY >= y &&
      ev.clientY <= y + height
    );
  }

  function tracking(node: HTMLElement) {
    const target = findButtonSibling(node) ?? node;

    const destroy = GlobalEventBus.getInstance().register("mousemove", (ev) => {
      const { x, y } = getCenter(target);
      const distance = (ev.clientX - x) ** 2 + (ev.clientY - y) ** 2;

      if (isIntersecting(target, ev)) {
        onObserve("show-me-what-you-got");
        return;
      }

      if (distance < proximityDistance) {
        onObserve("watching");
        return;
      }

      onObserve("idle");
    });

    return {
      destroy,
    };
  }
</script>

<div use:tracking class="cromulon-tracker"></div>

<style>
  .cromulon-tracker {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
</style>
