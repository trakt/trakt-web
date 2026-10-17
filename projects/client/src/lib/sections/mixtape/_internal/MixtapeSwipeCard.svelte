<script lang="ts">
  import FlipCard from "$lib/components/card/FlipCard.svelte";
  import InfoIcon from "$lib/components/icons/InfoIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import TodayPosterDetails from "$lib/sections/today/TodayPosterDetails.svelte";
  import MixtapeMatchTag from "./MixtapeMatchTag.svelte";
  import type { MixtapeSwipeCardProps } from "./MixtapeSwipeCardProps.ts";
  import { SWIPE_COMMIT_DISTANCE } from "./SWIPE_COMMIT_DISTANCE.ts";

  const {
    slot,
    dx,
    leaving,
    isDragging,
    isFlipped,
    isHinting,
  }: MixtapeSwipeCardProps = $props();

  const strength = $derived(Math.min(Math.abs(dx) / SWIPE_COMMIT_DISTANCE, 1));
  const rightStrength = $derived(
    leaving === "right" ? 1 : dx > 0 ? strength : 0,
  );
  const leftStrength = $derived(leaving === "left" ? 1 : dx < 0 ? strength : 0);
</script>

<div
  class="trakt-mixtape-swipe-card"
  class:is-dragging={isDragging}
  class:is-hinting={isHinting}
  data-leaving={leaving}
  style:--card-dx={`${dx}px`}
  style:--card-tilt={`${dx / 18}deg`}
  style:--right-strength={rightStrength}
  style:--left-strength={leftStrength}
>
  <div class="card-nudge">
    <FlipCard
      {isFlipped}
      --border-radius-flip-card="var(--border-radius-l)"
      --height-flip-card="100%"
    >
      {#snippet front()}
        <div class="card-face">
          <CrossOriginImage
            src={slot.media.poster.url.medium}
            alt={m.image_alt_media_poster({ title: slot.media.title })}
          />
          <div class="card-tint is-right"></div>
          <div class="card-tint is-left"></div>
          {#if isHinting}
            <div class="card-chip">
              <InfoIcon />
              <span>{m.tag_mixtape_tap_details()}</span>
            </div>
          {/if}
          <div class="card-match">
            <MixtapeMatchTag match={slot.match} />
          </div>
        </div>
      {/snippet}
      {#snippet back()}
        <div class="card-face is-back">
          {#if isFlipped}
            <TodayPosterDetails media={slot.media} />
          {/if}
        </div>
      {/snippet}
    </FlipCard>
    <div class="card-stamp is-right" aria-hidden="true">
      {m.button_text_watchlist()}
    </div>
    <div class="card-stamp is-left" aria-hidden="true">
      {m.button_text_mixtape_not_this()}
    </div>
  </div>
</div>

<style lang="scss">
  .trakt-mixtape-swipe-card {
    --leave-distance: calc(var(--ni-320) * 1.6);

    position: absolute;
    inset: 0;

    transform: translateX(var(--card-dx)) rotate(var(--card-tilt));
    transition: transform var(--transition-increment)
      cubic-bezier(0.2, 0.8, 0.2, 1);

    &.is-dragging {
      transition: none;
    }

    &[data-leaving="right"] {
      transform: translateX(var(--leave-distance)) rotate(22deg);
      transition: transform 260ms ease-in;
    }

    &[data-leaving="left"] {
      transform: translateX(calc(-1 * var(--leave-distance))) rotate(-22deg);
      transition: transform 260ms ease-in;
    }
  }

  .card-nudge {
    position: absolute;
    inset: 0;

    :global(.trakt-flip-card) {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: minmax(0, 1fr);
    }

    .is-hinting & {
      animation: mixtape-nudge 2.6s ease-in-out 0.7s 2;
    }
  }

  .card-face {
    position: relative;
    height: 100%;
    overflow: hidden;

    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      pointer-events: none;
    }

    &.is-back {
      overflow-y: auto;
      overscroll-behavior: contain;
      touch-action: pan-y;

      border: var(--border-thickness-xxs) solid var(--color-border);
    }
  }

  .card-tint {
    position: absolute;
    inset: 0;
    pointer-events: none;

    &.is-right {
      opacity: var(--right-strength);
      background: linear-gradient(
        270deg,
        color-mix(in srgb, var(--purple-500) 70%, transparent),
        transparent 70%
      );
    }

    &.is-left {
      opacity: var(--left-strength);
      background: linear-gradient(
        90deg,
        color-mix(in srgb, var(--shade-940) 75%, transparent),
        transparent 70%
      );
    }
  }

  .card-chip {
    position: absolute;
    inset-block-end: var(--gap-s);
    inset-inline-start: var(--gap-s);

    display: flex;
    align-items: center;
    gap: var(--ni-4);
    padding: var(--ni-4) var(--ni-10);

    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--shade-940) 70%, transparent);
    color: var(--shade-10);
    font-size: var(--font-size-text-small);
    font-weight: 700;

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }

  .card-match {
    position: absolute;
    inset-block-end: var(--gap-s);
    inset-inline-end: var(--gap-s);
  }

  .card-stamp {
    position: absolute;
    inset-block-start: var(--ni-22);
    padding: var(--ni-6) var(--ni-12);

    border: var(--border-thickness-xs) solid currentColor;
    border-radius: var(--border-radius-s);

    font-size: var(--ni-14);
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    pointer-events: none;

    &.is-right {
      inset-inline-start: var(--ni-18);
      color: var(--purple-200);
      transform: rotate(-12deg);
      opacity: var(--right-strength);
    }

    &.is-left {
      inset-inline-end: var(--ni-18);
      color: var(--shade-50);
      transform: rotate(12deg);
      opacity: var(--left-strength);
    }

    .is-hinting &.is-right {
      animation: mixtape-hint-right 2.6s ease-in-out 0.7s 2;
    }

    .is-hinting &.is-left {
      animation: mixtape-hint-left 2.6s ease-in-out 0.7s 2;
    }
  }

  .is-hinting .card-tint.is-right {
    animation: mixtape-hint-right 2.6s ease-in-out 0.7s 2;
  }

  .is-hinting .card-tint.is-left {
    animation: mixtape-hint-left 2.6s ease-in-out 0.7s 2;
  }

  @keyframes mixtape-nudge {
    0%,
    30%,
    60%,
    100% {
      transform: none;
    }
    15% {
      transform: translateX(var(--ni-44)) rotate(4deg);
    }
    45% {
      transform: translateX(calc(-1 * var(--ni-44))) rotate(-4deg);
    }
  }

  @keyframes mixtape-hint-right {
    0%,
    30%,
    100% {
      opacity: 0;
    }
    15% {
      opacity: 1;
    }
  }

  @keyframes mixtape-hint-left {
    0%,
    30%,
    60%,
    100% {
      opacity: 0;
    }
    45% {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .card-nudge,
    .card-tint,
    .card-stamp {
      animation: none !important;
    }
  }
</style>
