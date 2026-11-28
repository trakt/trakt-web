<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import { desertField } from "./desertField.ts";
  import type { WormSign } from "./WormSign.ts";

  const { wormSign }: { wormSign: WormSign } = $props();

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);
  let canvas = $state<HTMLCanvasElement>();

  $effect(() => {
    if (!canvas) return;
    return desertField({ canvas, animate: !$isReducedMotion, wormSign });
  });
</script>

<div class="topic-backdrop" aria-hidden="true">
  <canvas class="topic-layer" bind:this={canvas}></canvas>
  <div class="topic-layer dn3-veil"></div>
</div>
