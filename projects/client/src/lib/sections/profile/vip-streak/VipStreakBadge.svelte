<script lang="ts" module>
  const BURST_DOT_COUNT = 10;

  function burstDots() {
    return Array.from({ length: BURST_DOT_COUNT }, (_, index) => {
      const angle = (index / BURST_DOT_COUNT) * Math.PI * 2;
      return { x: Math.cos(angle), y: Math.sin(angle) };
    });
  }
</script>

<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toVipVeteranLabel } from "$lib/features/vip-veteran/toVipVeteranLabel.ts";
  import { toVipVeteranTitleTone } from "$lib/features/vip-veteran/toVipVeteranTitleTone.ts";
  import { toVipVeteranTone } from "$lib/features/vip-veteran/toVipVeteranTone.ts";
  import type { VipVeteranPromotion } from "$lib/features/vip-veteran/VipVeteranPromotion.ts";
  import type { VipVeteran } from "$lib/requests/models/VipVeteran.ts";
  import { onMount } from "svelte";
  import { profileDrawerNavigation } from "../_internal/profileDrawerNavigation.ts";

  const {
    veteran,
    promotion,
    isDirector = false,
  }: {
    veteran: VipVeteran;
    promotion?: VipVeteranPromotion | null;
    isDirector?: boolean;
  } = $props();

  const { buildVipStreakDrawerLink } = profileDrawerNavigation();
  const drawerLink = $derived(buildVipStreakDrawerLink());

  const tone = $derived(toVipVeteranTone(veteran.tier));
  const label = $derived(toVipVeteranLabel(veteran.title));
  const dots = burstDots();

  onMount(() => {
    if (!promotion) return;
    navigator.vibrate?.([12, 60, 12]);
  });
</script>

<div
  class="trakt-vip-streak-badge"
  class:is-promotion={promotion != null}
  data-tone={tone}
>
  <Link
    href={drawerLink.href}
    noscroll={drawerLink.noscroll}
    replacestate={drawerLink.replacestate}
    color="inherit"
    label={m.button_label_open_vip_streak()}
    onclick={() => navigator.vibrate?.(8)}
  >
    {#if promotion}
      <span class="badge-flip">
        <span class="flip-face flip-front">
          <VipBadge
            tone={toVipVeteranTitleTone(promotion.from)}
            label={toVipVeteranLabel(promotion.from)}
            {isDirector}
          />
        </span>
        <span class="flip-face flip-back">
          <VipBadge {tone} {label} {isDirector} />
        </span>
      </span>
    {:else}
      <VipBadge {tone} {label} {isDirector} />
    {/if}
  </Link>

  {#if promotion}
    <span class="badge-burst" aria-hidden="true">
      {#each dots as dot, index (index)}
        <span class="burst-dot" style="--dot-x: {dot.x}; --dot-y: {dot.y};"
        ></span>
      {/each}
    </span>
    <span class="visually-hidden" role="status">
      {m.text_vip_veteran_promoted({ title: label })}
    </span>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-streak-badge {
    --burst-color: var(--color-glow-vip-badge-vip);

    position: relative;
    display: flex;
    animation: vip-streak-pop 420ms cubic-bezier(0.3, 1.5, 0.6, 1) 200ms both;

    &[data-tone="deep"] {
      --burst-color: var(--color-glow-vip-badge-deep);
    }

    &[data-tone="copper"] {
      --burst-color: var(--color-glow-vip-badge-copper);
    }

    &[data-tone="silver"] {
      --burst-color: var(--color-glow-vip-badge-silver);
    }

    &[data-tone="gold"] {
      --burst-color: var(--color-glow-vip-badge-gold);
    }

    :global(.trakt-link) {
      display: flex;
      text-decoration: none;
      border-radius: var(--border-radius-xl);
    }
  }

  .badge-flip {
    display: grid;
    perspective: var(--ni-240);
    transform-style: preserve-3d;
    animation: badge-flip 700ms cubic-bezier(0.4, 0, 0.2, 1) 900ms both;
  }

  .flip-face {
    grid-area: 1 / 1;
    display: flex;
    justify-content: center;
    backface-visibility: hidden;
  }

  .flip-back {
    transform: rotateY(180deg);
  }

  .badge-burst {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .burst-dot {
    position: absolute;
    top: 50%;
    left: 50%;

    width: var(--ni-6);
    height: var(--ni-6);
    margin: calc(var(--ni-6) / -2);
    border-radius: 50%;
    background-color: var(--burst-color);

    animation: badge-burst 620ms cubic-bezier(0.2, 0.8, 0.3, 1) 1.25s both;
  }

  .visually-hidden {
    @include visually-hidden;
  }

  @keyframes vip-streak-pop {
    from {
      opacity: 0;
      transform: scale(0.6);
    }
  }

  @keyframes badge-flip {
    to {
      transform: rotateY(180deg);
    }
  }

  @keyframes badge-burst {
    0% {
      opacity: 0;
      transform: translate(0, 0) scale(0.4);
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(
          calc(var(--dot-x) * var(--ni-48)),
          calc(var(--dot-y) * var(--ni-28))
        )
        scale(0.6);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-vip-streak-badge {
      animation: none;
    }

    .badge-flip {
      animation: none;
      transform: rotateY(180deg);
    }

    .badge-burst {
      display: none;
    }

    .trakt-vip-streak-badge.is-promotion :global(.trakt-vip-badge) {
      box-shadow: 0 0 var(--ni-16)
        color-mix(in srgb, var(--burst-color) 70%, transparent);
    }
  }
</style>
