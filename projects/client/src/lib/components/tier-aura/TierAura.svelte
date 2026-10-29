<script lang="ts">
  import CompactAura from "./_internal/CompactAura.svelte";
  import DirectorAura from "./_internal/DirectorAura.svelte";
  import FullAura from "./_internal/FullAura.svelte";
  import InsetAura from "./_internal/InsetAura.svelte";
  import { tierAuraMotion } from "./_internal/tierAuraMotion.ts";
  import type { TierAuraProps } from "./TierAuraProps.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";

  const {
    tier,
    variant = "compact",
    motion = "hover",
    children,
  }: TierAuraProps = $props();

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const shownMotion = $derived(
    tier === "free" || variant === "inset" || $isReducedMotion
      ? "still"
      : motion,
  );
  const hasShine = $derived(shownMotion !== "still");
</script>

<span
  class="trakt-tier-aura"
  data-member-tier={tier}
  data-variant={variant}
  data-motion={shownMotion}
  {@attach tierAuraMotion({ tier, motion: shownMotion })}
>
  {#if variant === "compact" && tier === "director"}
    <DirectorAura isCompact />
  {:else if variant === "compact"}
    <CompactAura isStill={tier === "free"} />
  {:else if variant === "full"}
    <FullAura {tier} />
  {/if}

  <span class="aura-face">
    {@render children()}
  </span>

  {#if variant === "inset"}
    <InsetAura />
  {/if}

  {#if hasShine}
    <span class="aura-shine" aria-hidden="true">
      <span class="shine-ring" data-shine="ring"></span>
      <span class="shine-face">
        <span class="shine-band" data-shine="band"></span>
      </span>
      <span class="shine-sparks" data-shine="sparks"></span>
    </span>
  {/if}
</span>

<style lang="scss">
  @use "./_internal/aura" as *;

  .trakt-tier-aura {
    --aura-face-edge: color-mix(in srgb, var(--aura-hi) 40%, transparent);

    --u: calc(100cqi / 148);

    --aura-facets: conic-gradient(
      from 200deg,
      var(--aura-hi) 8.33%,
      var(--aura-light) 25%,
      var(--aura-mid) 41.67%,
      var(--aura-deep) 58.33%,
      var(--aura-mid) 75%,
      var(--aura-light) 91.67%,
      var(--aura-hi)
    );
    --aura-facets-dark: conic-gradient(
      from 200deg,
      var(--aura-hi) 8.33%,
      var(--aura-light) 25%,
      color-mix(in srgb, var(--aura-mid) 85%, var(--aura-black)) 41.67%,
      color-mix(in srgb, var(--aura-deep) 70%, var(--aura-black)) 58.33%,
      color-mix(in srgb, var(--aura-mid) 85%, var(--aura-black)) 75%,
      var(--aura-light) 91.67%,
      var(--aura-hi)
    );

    position: relative;
    display: block;
    inline-size: 100%;
    block-size: 100%;
    container-type: size;

    &[data-member-tier="free"] {
      --aura-face-edge: color-mix(in srgb, var(--aura-hi) 20%, transparent);
    }

    &[data-member-tier="veteran"] {
      --aura-face-edge: color-mix(in srgb, var(--aura-light) 40%, transparent);
    }

    &[data-member-tier="elite"] {
      --aura-face-edge: color-mix(in srgb, var(--aura-light) 40%, transparent);
      --u: calc(100cqi / 140);
    }

    &[data-member-tier="legend"] {
      --aura-face-edge: color-mix(in srgb, var(--aura-hi) 85%, transparent);
      --u: calc(100cqi / 140);
    }

    &[data-member-tier="director"] {
      --aura-face-edge: color-mix(in srgb, var(--aura-white) 85%, transparent);
      --u: calc(100cqi / 140);
    }

    &[data-member-tier="director"][data-variant="compact"] {
      --u: calc(100cqi / 70);
    }
  }

  .aura-face {
    position: relative;
    display: block;
    inline-size: 100%;
    block-size: 100%;
    border-radius: 50%;
    overflow: hidden;
    background: var(--aura-face);

    [data-variant="full"] & {
      box-shadow:
        0 0 0 calc(var(--u) * 3)
          var(--tier-aura-surface, var(--color-background)),
        0 0 0 calc(var(--u) * 3 + 1px) var(--aura-face-edge),
        0 calc(var(--u) * 10) calc(var(--u) * 24)
          color-mix(in srgb, var(--aura-black) 45%, transparent);
    }
  }

  .aura-shine {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .shine-ring {
    position: absolute;
    inset: -3.5px;
    border-radius: 50%;
    opacity: 0;
    mix-blend-mode: screen;

    @include ring-mask(3px);
  }

  .shine-face {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    overflow: hidden;
  }

  .shine-band {
    position: absolute;
    inset-block-start: -50%;
    inset-inline-start: -50%;
    inline-size: 200%;
    block-size: 200%;
    opacity: 0;
    mix-blend-mode: screen;
    background: linear-gradient(
      90deg,
      transparent 40%,
      color-mix(in srgb, var(--aura-white) 12%, transparent) 46%,
      color-mix(in srgb, var(--aura-white) 60%, transparent) 49.4%,
      color-mix(in srgb, var(--aura-white) 95%, transparent) 50%,
      color-mix(in srgb, var(--aura-white) 35%, transparent) 51.5%,
      color-mix(in srgb, var(--aura-white) 8%, transparent) 55%,
      transparent 60%
    );
  }

  .shine-sparks {
    position: absolute;
    inset: 0;

    :global(.shine-spark) {
      position: absolute;
      opacity: 0;
      background: var(--aura-white);
      clip-path: $spark;
      filter: drop-shadow(
        0 0 3px color-mix(in srgb, var(--aura-white) 90%, transparent)
      );
    }
  }

  @keyframes -global-tier-aura-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes -global-tier-aura-spin-back {
    to {
      transform: rotate(-360deg);
    }
  }

  @keyframes -global-tier-aura-breathe {
    0%,
    100% {
      opacity: 0.55;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.06);
    }
  }

  @keyframes -global-tier-aura-twinkle {
    0%,
    100% {
      opacity: 0.25;
      transform: scale(0.55);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes -global-tier-aura-glint {
    0%,
    82%,
    100% {
      opacity: 0;
      transform: scale(0.3) rotate(0deg);
    }
    90% {
      opacity: 1;
      transform: scale(1) rotate(45deg);
    }
  }

  @keyframes -global-tier-aura-sweep {
    0% {
      opacity: 0;
      transform: rotate(-75deg);
    }
    5%,
    15% {
      opacity: 1;
    }
    21%,
    100% {
      opacity: 0;
      transform: rotate(65deg);
    }
  }
</style>
