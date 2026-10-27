<script lang="ts">
  import { toPolygonClipPath } from "./toPolygonClipPath.ts";

  const crown = toPolygonClipPath(12);
  const glints = [
    { x: 86, y: 20, delay: 0.4 },
    { x: 12, y: 74, delay: 2.4 },
  ];
</script>

<!-- Legend: a twelve-sided gold crown with warm fire under a cut rim. -->
<span class="aura-slot">
  <span class="legend-glow"></span>
  <span class="legend-halo"></span>
  <span class="legend-crown">
    <span class="crown-facets" style:clip-path={crown}></span>
    <span class="crown-fire" style:clip-path={crown}></span>
  </span>
  <span class="legend-backing"></span>
  <span class="legend-rim"></span>
  {#each glints as glint, index (index)}
    <span
      class="legend-glint"
      style:inset-inline-start="{glint.x}%"
      style:inset-block-start="{glint.y}%"
      style:--glint-delay="{glint.delay}s"
    ></span>
  {/each}
</span>

<style lang="scss">
  @use "./aura" as *;

  .aura-slot {
    @include slot(15);
  }

  .legend-glow {
    @include layer(-26);
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--aura-light) 30%, transparent) 0%,
      color-mix(in srgb, var(--aura-mid) 22%, transparent) 34%,
      transparent 64%
    );

    @include motion {
      animation: tier-aura-breathe 4.2s ease-in-out infinite;
    }
  }

  .legend-halo {
    @include layer(-10);
    opacity: 0.3;
    background: var(--aura-legend-fire);
    filter: blur(calc(var(--u) * 11));

    @include motion {
      animation: tier-aura-spin 12s linear infinite;
    }
  }

  .legend-crown {
    @include layer(2);
    border-radius: 0;

    @include motion {
      animation: tier-aura-spin 60s linear infinite;
    }
  }

  .crown-facets,
  .crown-fire {
    position: absolute;
    inset: 0;
  }

  .crown-facets {
    background: var(--aura-legend-crown);
  }

  .crown-fire {
    opacity: 0.85;
    mix-blend-mode: overlay;
    background: var(--aura-legend-fire);

    @include motion {
      animation: tier-aura-spin-back 9s linear infinite;
    }
  }

  .legend-backing {
    @include layer(11);
    background: var(--tier-aura-surface, var(--color-background));
  }

  .legend-rim {
    @include layer(11);
    @include ring-mask(calc(var(--u) * 2));
    background: conic-gradient(
      from 200deg,
      var(--aura-deep),
      var(--aura-mid) 60deg,
      var(--aura-hi) 110deg,
      var(--aura-light) 140deg,
      var(--aura-mid) 200deg,
      var(--aura-deep) 260deg,
      var(--aura-mid) 320deg,
      var(--aura-deep)
    );
    filter: drop-shadow(
      0 0 calc(var(--u) * 4)
        color-mix(in srgb, var(--aura-light) 80%, transparent)
    );
  }

  .legend-glint {
    position: absolute;
    inline-size: calc(var(--u) * 12);
    block-size: calc(var(--u) * 12);
    translate: calc(var(--rtl-sign, 1) * -50%) -50%;
    opacity: 0;
    background: var(--aura-white);
    clip-path: $spark;
    filter: drop-shadow(0 0 calc(var(--u) * 4) var(--aura-light));

    @include motion {
      animation: tier-aura-glint 4.8s ease-in-out var(--glint-delay) infinite;
    }
  }
</style>
