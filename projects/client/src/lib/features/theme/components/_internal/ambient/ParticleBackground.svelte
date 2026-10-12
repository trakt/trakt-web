<script lang="ts" generics="P extends Particle">
  import type { Particle } from "./Particle";
  import type { ParticlePainter } from "./ParticlePainter";
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
    inset: 0;

    pointer-events: none;

    z-index: var(--layer-background);
  }
</style>
