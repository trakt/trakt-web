<script lang="ts">
  const { isStill }: { isStill: boolean } = $props();
</script>

<!-- Two faceted bands around a list avatar: a 1.5px band and a hairline. -->
<span class="compact-glow"></span>
<span class="compact-band inner-tint"></span>
<span class="compact-band outer-tint"></span>
<span class="compact-band inner-facets"></span>
<span class="compact-band inner-glare"></span>
{#if !isStill}
  <span class="compact-band inner-sweep"></span>
{/if}
<span class="compact-band outer-facets"></span>

<style lang="scss">
  @use "./aura" as *;

  .compact-glow,
  .compact-band {
    position: absolute;
    display: block;
    border-radius: 50%;
    pointer-events: none;
  }

  .compact-glow {
    inset: -4.75px;
    box-shadow:
      0 0 8px color-mix(in srgb, var(--aura-light) 30%, transparent),
      0 0 18px color-mix(in srgb, var(--aura-mid) 22%, transparent);

    :global([data-tier="free"]) & {
      box-shadow: 0 2px 6px
        color-mix(in srgb, var(--aura-black) 45%, transparent);
    }
  }

  .inner-tint,
  .inner-facets,
  .inner-glare,
  .inner-sweep {
    inset: -2.5px;
    @include ring-mask(1.5px);
  }

  .outer-tint,
  .outer-facets {
    inset: -4px;
    @include ring-mask(0.75px);
  }

  .inner-tint,
  .outer-tint {
    background: color-mix(in srgb, var(--aura-mid) 55%, transparent);
  }

  .inner-facets,
  .inner-glare {
    background: var(--aura-facets-dark);
  }

  .inner-facets {
    @include motion {
      animation: tier-aura-spin 14s linear infinite;
    }
  }

  .inner-glare {
    opacity: 0.5;
    mix-blend-mode: screen;

    :global([data-tier="free"]) & {
      opacity: 0.25;
    }

    @include motion {
      animation: tier-aura-spin-back 9s linear infinite;
    }
  }

  .inner-sweep {
    background: conic-gradient(
      transparent 0 300deg,
      var(--aura-hi) 335deg,
      transparent 360deg
    );

    @include motion {
      animation: tier-aura-spin 6s linear infinite;
    }
  }

  .outer-facets {
    opacity: 0.85;
    background: var(--aura-facets);

    :global([data-tier="free"]) & {
      opacity: 0.6;
    }

    @include motion {
      animation: tier-aura-spin-back 11s linear infinite;
    }
  }
</style>
