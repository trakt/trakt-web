<script lang="ts">
  import { GlobalEventBus } from "$lib/utils/events/GlobalEventBus";
  import type { CromulonState } from "./CromulonState";

  const { onObserve }: { onObserve: (state: CromulonState) => void } = $props();

  // More efficient to compare squared distances than to calculate square roots
  const proximityDistance = 85 ** 2;

  function getCenter(node: HTMLElement) {
    const { x, y, width, height } = node.getBoundingClientRect();
    return { x: x + width / 2, y: y + height / 2 };
  }

  function tracking(node: HTMLElement) {
    const destroy = GlobalEventBus.getInstance().register("mousemove", (ev) => {
      const { x, y } = getCenter(node);
      const distance = (ev.clientX - x) ** 2 + (ev.clientY - y) ** 2;

      if (distance < proximityDistance) {
        onObserve("watching");
      } else {
        onObserve("idle");
      }
    });

    return {
      destroy,
    };
  }
</script>

<div use:tracking class="cromulon-tracker"></div>
