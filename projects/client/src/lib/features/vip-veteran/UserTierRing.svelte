<script lang="ts">
  import type { Snippet } from "svelte";
  import { userTierRingMotion } from "./_internal/userTierRingMotion.ts";
  import UserTierShine from "./_internal/UserTierShine.svelte";
  import type { UserTierRingMotion } from "./UserTierRingMotion.ts";
  import type { TieredUser } from "./TieredUser.ts";
  import { toUserTier } from "./toUserTier.ts";

  type UserTierRingProps = {
    member: TieredUser | Nil;
    motion?: UserTierRingMotion;
    hasEntrance?: boolean;
    isHighlighted?: boolean;
    children: Snippet;
  };

  const {
    member,
    motion = "hover",
    hasEntrance = false,
    isHighlighted = false,
    children,
  }: UserTierRingProps = $props();

  const tier = $derived(toUserTier(member));
  const shownMotion = $derived(tier === "free" ? "still" : motion);
</script>

<span
  class="trakt-user-tier-ring"
  class:has-entrance={hasEntrance}
  class:is-highlighted={isHighlighted}
  data-user-tier={tier}
  data-motion={shownMotion}
  {@attach userTierRingMotion(tier)}
>
  <span class="tier-frame">
    <span class="tier-ring" aria-hidden="true">
      <span class="ring-band"> </span>
    </span>
    <span class="tier-face">
      {@render children()}
    </span>

    <UserTierShine />
  </span>
</span>

<style lang="scss">
  @use "./_internal/ringMask" as *;

  @mixin motion {
    @media (prefers-reduced-motion: no-preference) {
      :global(
          .trakt-user-tier-ring:is(
            [data-motion="live"],
            [data-motion="hover"].is-awake
          )
        )
        & {
        @content;
      }

      :global(
          .trakt-user-tier-ring[data-motion="hover"].is-awake:not(.is-playing)
        )
        & {
        animation-play-state: paused;
      }
    }
  }

  .trakt-user-tier-ring {
    --ring-width: max(var(--border-thickness-xs), calc(100cqi * 0.038));
    --ring-gap: max(1.5px, calc(100cqi * 0.028));
    --ring-pin: max(1px, calc(100cqi * 0.012));
    --ring-turn: 16s;
    --tier: var(--user-tier-ring-color);
    --tier-sheen: var(--user-tier-ring-sheen);
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

    &[data-user-tier="free"] {
      --ring-width: max(1px, calc(100cqi * 0.008));
      --ring: var(--color-user-tier-free-ring);
      --shine-light: var(--color-user-tier-free-glint);
      --shine-width: var(--border-thickness-xs);
    }

    &[data-user-tier="legend"] {
      --ring: var(--color-user-tier-legend-ring-fill);
      --ring-halo: var(--shadow-user-tier-legend);
    }

    &.is-highlighted {
      box-shadow: 0 0 var(--ni-10)
        color-mix(
          in srgb,
          var(--highlight-color, var(--tier-sheen)) var(--user-tier-active-glow),
          transparent
        );
    }

    &.is-highlighted[data-user-tier="free"] {
      --highlight-color: var(--color-link-active);
    }

    @media (prefers-reduced-motion: no-preference) {
      transition: box-shadow var(--transition-increment) ease-in-out;
    }

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 50%;
      opacity: 0;
      box-shadow: 0 0 calc(14cqi)
        color-mix(in srgb, var(--tier-sheen) 70%, transparent);
    }

    @media (prefers-reduced-motion: no-preference) {
      &.has-entrance::before {
        animation: tier-ring-swell 1.2s ease-out 0.2s both;
      }
    }
  }

  .tier-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: var(--ring-halo, none);
  }

  .ring-band {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--ring);
    @include ring-mask(var(--ring-width));

    @include motion {
      animation: tier-ring-turn var(--ring-turn) linear infinite;
    }
  }

  .tier-frame {
    display: contents;
  }

  @container (inline-size < 32px) {
    .tier-frame {
      --ring-gap: 0px;
    }
  }

  .tier-face {
    position: absolute;
    inset: calc(var(--ring-width) + var(--ring-gap));
    display: block;
    border-radius: 50%;
    overflow: hidden;

    :global(img) {
      display: block;
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }
  }

  @keyframes tier-ring-turn {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes tier-ring-swell {
    40% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>
