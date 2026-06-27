<script lang="ts">
  import { snowRenderer } from "./snowRenderer";
</script>

<canvas use:snowRenderer class="trakt-snow-canvas" aria-hidden="true"></canvas>

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
