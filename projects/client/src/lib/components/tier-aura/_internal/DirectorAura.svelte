<script lang="ts">
  import { toPolygonClipPath } from "./toPolygonClipPath.ts";

  const { isCompact = false }: { isCompact?: boolean } = $props();

  const crown = toPolygonClipPath(16);
  const girdle = toPolygonClipPath(16, Math.PI / 16);
  const glints = [
    { x: 14, y: 8, delay: 0 },
    { x: 88, y: 30, delay: 0.7 },
    { x: 92, y: 76, delay: 1.5 },
    { x: 10, y: 70, delay: 2.2 },
    { x: 50, y: -4, delay: 2.9 },
  ];
</script>

<!--
  Directors: a brilliant cut, two sixteen-sided crowns turning against
  each other with prism fire. In lists only the rim around the face shows.
-->
{#if isCompact}
  <span class="director-list-glow"></span>
{/if}
<span class="aura-slot" class:is-compact={isCompact}>
  <span class="director-glow"></span>
  <span class="director-halo"></span>
  <span class="director-crown">
    <span class="crown-facets" style:clip-path={crown}></span>
    <span class="crown-fire" style:clip-path={crown}></span>
  </span>
  <span class="director-girdle">
    <span class="girdle-facets" style:clip-path={girdle}></span>
    <span class="girdle-fire" style:clip-path={girdle}></span>
  </span>
  <span class="director-backing"></span>
  <span class="director-prism"></span>
  {#each glints as glint, index (index)}
    <span
      class="director-glint"
      style:inset-inline-start="{glint.x}%"
      style:inset-block-start="{glint.y}%"
      style:--glint-delay="{glint.delay}s"
    ></span>
  {/each}
</span>
{#if isCompact}
  <span class="director-list-edge"></span>
{/if}

<style lang="scss">
  @use "./aura" as *;

  .aura-slot {
    @include slot(15);

    &.is-compact {
      $rim: radial-gradient(
        circle at 50% 50%,
        #000 calc(50cqi + 4.5px),
        transparent calc(50cqi + 6.5px)
      );

      -webkit-mask: $rim;
      mask: $rim;
    }
  }

  .director-list-glow,
  .director-list-edge {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  .director-list-glow {
    inset: -6px;
    box-shadow: 0 0 12px
      color-mix(in srgb, var(--aura-director-glow) 35%, transparent);
  }

  .director-list-edge {
    inset: -6.5px;
    box-shadow: inset 0 0 0 1px
      color-mix(in srgb, var(--aura-white) 35%, transparent);
  }

  .director-glow {
    @include layer(-28);
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--aura-white) 28%, transparent) 0%,
      color-mix(in srgb, var(--aura-director-glow) 14%, transparent) 34%,
      transparent 64%
    );

    @include motion {
      animation: tier-aura-breathe 3.6s ease-in-out infinite;
    }
  }

  .director-halo {
    @include layer(-14);
    opacity: 0.35;
    background: var(--aura-director-fire);
    filter: blur(calc(var(--u) * 12));

    @include motion {
      animation: tier-aura-spin 9s linear infinite;
    }
  }

  .director-crown {
    @include layer(0);
    border-radius: 0;

    @include motion {
      animation: tier-aura-spin 48s linear infinite;
    }
  }

  .director-girdle {
    @include layer(6);
    border-radius: 0;

    @include motion {
      animation: tier-aura-spin-back 32s linear infinite;
    }
  }

  .crown-facets,
  .crown-fire,
  .girdle-facets,
  .girdle-fire {
    position: absolute;
    inset: 0;
  }

  .crown-facets {
    background: var(--aura-director-crown);
  }

  .girdle-facets {
    background: var(--aura-director-girdle);
  }

  .crown-fire {
    opacity: 0.9;
    mix-blend-mode: overlay;
    background: var(--aura-director-fire);

    @include motion {
      animation: tier-aura-spin-back 7s linear infinite;
    }
  }

  .girdle-fire {
    opacity: 0.45;
    mix-blend-mode: color;
    background: var(--aura-director-fire);

    @include motion {
      animation: tier-aura-spin 5s linear infinite;
    }
  }

  .director-backing {
    @include layer(11);
    background: var(--tier-aura-surface, var(--color-background));
  }

  .director-prism {
    @include layer(11);
    @include ring-mask(calc(var(--u) * 2));
    background: var(--aura-director-fire);
    filter: drop-shadow(0 0 calc(var(--u) * 5) var(--aura-white));

    @include motion {
      animation: tier-aura-spin-back 4s linear infinite;
    }
  }

  .director-glint {
    position: absolute;
    inline-size: calc(var(--u) * 13);
    block-size: calc(var(--u) * 13);
    translate: calc(var(--rtl-sign, 1) * -50%) -50%;
    opacity: 0;
    background: var(--aura-white);
    clip-path: $spark;
    filter: drop-shadow(0 0 calc(var(--u) * 4) var(--aura-white))
      drop-shadow(0 0 calc(var(--u) * 8) var(--aura-director-spark));

    @include motion {
      animation: tier-aura-glint 3.6s ease-in-out var(--glint-delay) infinite;
    }
  }
</style>
