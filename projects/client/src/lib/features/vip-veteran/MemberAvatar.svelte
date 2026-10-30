<script lang="ts">
  import type { Snippet } from "svelte";
  import { memberRingMotion } from "./_internal/memberRingMotion.ts";
  import { useVipVeteranEnabled } from "./stores/useVipVeteranEnabled.ts";
  import type { TieredMember } from "./TieredMember.ts";
  import { toMemberTier } from "./toMemberTier.ts";

  type MemberAvatarProps = {
    member: TieredMember | Nil;
    /** Live rings always play; hover rings play while their row is hovered. */
    motion?: "live" | "hover";
    /** Swells the ring once as it appears, as on a profile's own header. */
    hasEntrance?: boolean;
    children: Snippet;
  };

  const {
    member,
    motion = "hover",
    hasEntrance = false,
    children,
  }: MemberAvatarProps = $props();

  const isEnabled = useVipVeteranEnabled();
  const tier = $derived(toMemberTier(member));
  // Free is a plain hairline; it never moves.
  const shownMotion = $derived(tier === "free" ? "still" : motion);
</script>

<!--
  Draws a member's tier as a ring inside the avatar's own box, a hair off
  the photo, so layouts keep their size. With the tier preview off it renders
  the photo alone and hosts keep their own stroke.
-->
{#if $isEnabled}
  <span
    class="trakt-member-avatar"
    class:has-entrance={hasEntrance}
    data-tier={tier}
    data-motion={shownMotion}
    {@attach memberRingMotion({ tier, motion: shownMotion })}
  >
    <span class="member-ring" aria-hidden="true">
      <span class="ring-band">
        <span class="ring-inner"></span>
      </span>
    </span>
    <span class="member-face">
      {@render children()}
    </span>

    {#if shownMotion === "hover"}
      <span class="member-shine" aria-hidden="true">
        <span class="shine-ring" data-shine="ring"></span>
        <span class="shine-face">
          <span class="shine-band" data-shine="band"></span>
        </span>
        <span class="shine-sparks" data-shine="sparks"></span>
      </span>
    {/if}
  </span>
{:else}
  {@render children()}
{/if}

<style lang="scss">
  @mixin ring-mask($thickness) {
    $edge: radial-gradient(
      farthest-side,
      transparent calc(100% - #{$thickness}),
      #000 calc(100% - #{$thickness} + 0.5px)
    );

    -webkit-mask: $edge;
    mask: $edge;
  }

  // Motion runs on live rings, and on hover rings once their row wakes them;
  // a woken ring holds its frame when the pointer leaves.
  @mixin motion {
    @media (prefers-reduced-motion: no-preference) {
      :global(.trakt-member-avatar:is([data-motion="live"], .is-awake)) & {
        @content;
      }

      :global(.trakt-member-avatar.is-awake:not(.is-playing)) & {
        animation-play-state: paused;
      }
    }
  }

  .trakt-member-avatar {
    /* Sizes are shares of the avatar's width, so a ring scales with it. */
    --ring-width: max(1px, calc(100cqi * 0.038));
    --ring-gap: max(1.5px, calc(100cqi * 0.028));
    --ring-pin: max(1px, calc(100cqi * 0.012));
    --ring-turn: 16s;
    --tier: var(--member-tier-vip);
    --tier-sheen: var(--member-tier-vip-sheen);
    --ring: conic-gradient(
      from 180deg,
      var(--tier) 0deg,
      var(--tier) 120deg,
      var(--tier-sheen) 215deg,
      var(--tier) 290deg,
      var(--tier) 360deg
    );

    position: relative;
    display: block;
    inline-size: 100%;
    block-size: 100%;
    border-radius: 50%;
    container-type: size;
    isolation: isolate;

    &[data-tier="free"] {
      --ring-width: max(1px, calc(100cqi * 0.008));
      --ring: var(--color-member-tier-free-ring);
    }

    &[data-tier="pro"] {
      --tier: var(--member-tier-pro);
      --tier-sheen: var(--member-tier-pro-sheen);
    }

    &[data-tier="veteran"] {
      --tier: var(--member-tier-veteran);
      --tier-sheen: var(--member-tier-veteran-sheen);
    }

    &[data-tier="elite"] {
      --tier: var(--member-tier-elite);
      --tier-sheen: var(--member-tier-elite-sheen);
    }

    &[data-tier="legend"] {
      --tier: var(--member-tier-legend);
      --tier-sheen: var(--member-tier-legend-sheen);
      --ring: var(--member-tier-legend-ring);
      --ring-halo: var(--shadow-member-tier-legend);
    }

    &[data-tier="original"] {
      --ring-width: max(1px, calc(100cqi * 0.06));
      --ring-turn: 14s;
      --tier: var(--member-tier-original-rose);
      --tier-sheen: var(--member-tier-original-rose-light);
      --ring: var(--member-tier-original-ring);
      --ring-halo: var(--shadow-member-tier-original);
      --ring-inner: radial-gradient(
        closest-side,
        var(--member-tier-original-rose) calc(100% - var(--ring-width) / 2),
        var(--member-tier-original-rose-light)
          calc(100% - (var(--ring-width) / 2 - var(--ring-pin))),
        var(--member-tier-original-rose-deep) calc(100% - var(--ring-pin)),
        var(--member-tier-original-ink) calc(100% - var(--ring-pin))
      );
    }

    &[data-tier="director"] {
      --ring-width: max(1px, calc(100cqi * 0.05));
      --ring-turn: 9s;
      --tier: var(--member-tier-director-glow);
      --tier-sheen: var(--shade-10);
      --ring: var(--member-tier-director-facets);
      --ring-inner: var(--member-tier-director-facets-inner);
      --ring-halo: 0 0 calc(16cqi)
        color-mix(in srgb, var(--member-tier-director-glow) 45%, transparent);
    }
  }

  .member-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    box-shadow: var(--ring-halo, none);

    /* The entrance: one soft swell in the tier's colour. */
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 50%;
      opacity: 0;
      box-shadow: 0 0 calc(14cqi)
        color-mix(in srgb, var(--tier-sheen) 70%, transparent);

      @media (prefers-reduced-motion: no-preference) {
        .has-entrance & {
          animation: member-ring-swell 1.2s ease-out 0.2s both;
        }
      }
    }
  }

  .ring-band {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--ring);
    @include ring-mask(var(--ring-width));

    @include motion {
      animation: member-ring-turn var(--ring-turn) linear infinite;
    }
  }

  /* Director and Original lay a second band over the ring's inner half. */
  .ring-inner {
    display: none;
    position: absolute;
    inset: calc(var(--ring-width) / 2);
    border-radius: 50%;
    background: var(--ring-inner);
    @include ring-mask(calc(var(--ring-width) / 2));

    :is([data-tier="director"], [data-tier="original"]) & {
      display: block;
    }
  }

  .member-face {
    position: absolute;
    inset: calc(var(--ring-width) + var(--ring-gap));
    display: block;
    border-radius: 50%;
    overflow: hidden;

    [data-tier="free"] & :global(img) {
      filter: grayscale(0.35) brightness(0.92);
    }
  }

  .member-shine {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .shine-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    opacity: 0;
    @include ring-mask(var(--ring-width));
  }

  .shine-face {
    position: absolute;
    inset: calc(var(--ring-width) + var(--ring-gap));
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
    background: linear-gradient(
      90deg,
      transparent 40%,
      color-mix(in srgb, var(--shade-10) 10%, transparent) 46%,
      color-mix(in srgb, var(--shade-10) 45%, transparent) 49.4%,
      color-mix(in srgb, var(--shade-10) 70%, transparent) 50%,
      color-mix(in srgb, var(--shade-10) 25%, transparent) 51.5%,
      color-mix(in srgb, var(--shade-10) 6%, transparent) 55%,
      transparent 60%
    );
  }

  .shine-sparks {
    position: absolute;
    inset: 0;

    :global(.shine-spark) {
      position: absolute;
      opacity: 0;
      background: var(--tier-sheen);
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
    }
  }

  @keyframes member-ring-turn {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes member-ring-swell {
    40% {
      opacity: 1;
      transform: scale(1.06);
    }
    100% {
      opacity: 0;
      transform: scale(1);
    }
  }
</style>
