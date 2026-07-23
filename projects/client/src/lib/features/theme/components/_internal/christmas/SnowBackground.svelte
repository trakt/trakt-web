<script lang="ts">
  import { useAppearance } from "$lib/features/appearance/useAppearance.ts";
  import { snowRenderer } from "./snowRenderer";

  const { reduceVisualNoise } = useAppearance();
</script>

{#if !$reduceVisualNoise}
  <canvas use:snowRenderer class="trakt-snow-canvas" aria-hidden="true"></canvas>
{/if}

<style>
  .trakt-snow-canvas {
    position: fixed;
    top: 0;
    inset-inline-start: 0;
    width: 100vw;
    height: 100vh;

    pointer-events: none;

    z-index: var(--layer-background);
  }
</style>
