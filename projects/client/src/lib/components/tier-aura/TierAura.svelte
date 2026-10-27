<script lang="ts">
  import CompactAura from "./_internal/CompactAura.svelte";
  import EliteAura from "./_internal/EliteAura.svelte";
  import LegendAura from "./_internal/LegendAura.svelte";
  import RingAura from "./_internal/RingAura.svelte";
  import DirectorAura from "./_internal/DirectorAura.svelte";
  import { tierAuraMotion } from "./_internal/tierAuraMotion.ts";
  import VeteranAura from "./_internal/VeteranAura.svelte";
  import type { TierAuraProps } from "./TierAuraProps.ts";

  const {
    tier,
    variant = "compact",
    motion = "hover",
    children,
  }: TierAuraProps = $props();

  // Free is a plain hairline; it never moves.
  const shownMotion = $derived(tier === "free" ? "still" : motion);
  const hasShine = $derived(shownMotion === "hover");
</script>

<!--
  Draws a member's tier around their avatar. The aura fills its host's box,
  which is the face; every layer is drawn outside it, so layouts keep their
  alignment. Hosts set --tier-aura-surface to the colour the avatar sits on.
  Anything laid over an aura (a tag, a badge) must be opaque: mix its tint
  into --tier-aura-surface. Where avatars overlap or get clipped, as in
  stacks, leave the aura off.
-->
<span
  class="trakt-tier-aura"
  data-tier={tier}
  data-variant={variant}
  data-motion={shownMotion}
  {@attach tierAuraMotion({ tier, motion: shownMotion })}
>
  {#if variant === "compact" && tier === "director"}
    <DirectorAura isCompact />
  {:else if variant === "compact"}
    <CompactAura isStill={tier === "free"} />
  {:else if tier === "veteran"}
    <VeteranAura />
  {:else if tier === "elite"}
    <EliteAura />
  {:else if tier === "legend"}
    <LegendAura />
  {:else if tier === "director"}
    <DirectorAura />
  {:else}
    <RingAura {tier} />
  {/if}

  <span class="aura-face">
    {@render children()}
  </span>

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
  .trakt-tier-aura {
    --aura-deep: var(--aura-vip-deep);
    --aura-mid: var(--aura-vip-mid);
    --aura-light: var(--aura-vip-light);
    --aura-hi: var(--aura-vip-hi);
    --aura-face-edge: color-mix(in srgb, var(--aura-hi) 40%, transparent);

    /* A hundredth of the full cut, which is the face plus its setting. */
    --u: calc(100cqi / 74);

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

    &[data-tier="free"] {
      --aura-deep: var(--aura-free-deep);
      --aura-mid: var(--aura-free-mid);
      --aura-light: var(--aura-free-light);
      --aura-hi: var(--aura-free-hi);
      --aura-face-edge: color-mix(in srgb, var(--aura-hi) 20%, transparent);
    }

    &[data-tier="pro"] {
      --aura-deep: var(--aura-pro-deep);
      --aura-mid: var(--aura-pro-mid);
      --aura-light: var(--aura-pro-light);
      --aura-hi: var(--aura-pro-hi);
    }

    &[data-tier="veteran"] {
      --aura-deep: var(--aura-veteran-deep);
      --aura-mid: var(--aura-veteran-mid);
      --aura-light: var(--aura-veteran-light);
      --aura-hi: var(--aura-veteran-hi);
      --aura-face-edge: color-mix(in srgb, var(--aura-light) 40%, transparent);
    }

    &[data-tier="elite"] {
      --aura-deep: var(--aura-elite-deep);
      --aura-mid: var(--aura-elite-mid);
      --aura-light: var(--aura-elite-light);
      --aura-hi: var(--aura-elite-hi);
      --aura-face-edge: color-mix(in srgb, var(--aura-light) 40%, transparent);
      --u: calc(100cqi / 70);
    }

    &[data-tier="legend"] {
      --aura-deep: var(--aura-legend-deep);
      --aura-mid: var(--aura-legend-mid);
      --aura-light: var(--aura-legend-light);
      --aura-hi: var(--aura-legend-hi);
      --aura-face-edge: color-mix(in srgb, var(--aura-hi) 85%, transparent);
      --u: calc(100cqi / 70);
    }

    &[data-tier="director"] {
      --aura-deep: var(--aura-director-deep);
      --aura-mid: var(--aura-director-mid);
      --aura-light: var(--aura-director-light);
      --aura-hi: var(--aura-director-hi);
      --aura-face-edge: color-mix(in srgb, var(--aura-white) 85%, transparent);
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

    /* The face sits in its setting: a gap, a fine edge, a soft drop. */
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
    $edge: radial-gradient(
      farthest-side,
      transparent calc(100% - 3px),
      #000 calc(100% - 2.5px)
    );

    position: absolute;
    inset: -3.5px;
    border-radius: 50%;
    opacity: 0;
    mix-blend-mode: screen;
    -webkit-mask: $edge;
    mask: $edge;
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
      clip-path: polygon(
        50% 0,
        60% 40%,
        100% 50%,
        60% 60%,
        50% 100%,
        40% 60%,
        0 50%,
        40% 40%
      );
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
