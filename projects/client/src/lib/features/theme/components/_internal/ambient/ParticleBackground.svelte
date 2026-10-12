<script lang="ts" generics="P extends Particle">
  import type { Particle, ParticlePainter } from "./ParticlePainter";
  import { particleCanvas } from "./particleCanvas";

  const { painter }: { painter: ParticlePainter<P> } = $props();
</script>

<canvas
  use:particleCanvas={painter}
  class="trakt-particle-background"
  aria-hidden="true"
></canvas>

<style>
  .trakt-particle-background {
    position: fixed;
    top: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 100%;

    pointer-events: none;

    z-index: var(--layer-background);
  }
</style>
