<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { matchFaceSweep } from "./matchFaceSweep.ts";
  import type { MatchHeroProps } from "./MatchHeroProps.ts";
  import { useSharedMedia } from "./useSharedMedia.ts";

  const { score, label, user, profile, backdropEntry }: MatchHeroProps =
    $props();

  const media = useSharedMedia(fromRune(() => backdropEntry));
  const poster = $derived($media?.poster.url.medium);
</script>

<div
  class="trakt-match-hero"
  style:--match-hero-score={score}
  style:--match-hero-sweep-end={matchFaceSweep(score)}
  style:--label-length={label.length}
>
  <div class="cover" aria-hidden="true">
    {#if poster}
      <div class="halftone">
        <CrossOriginImage src={poster} alt="" loading="eager" animate={false} />
      </div>
      <CrossOriginImage
        classList="tint"
        src={poster}
        alt=""
        loading="eager"
        animate={false}
      />
      <div class="print"></div>
      <div class="sheen"></div>
    {/if}
    <div class="wash"></div>
    <div class="plate"></div>
    <div class="fade"></div>
  </div>

  <div class="ring">
    <svg viewBox="0 0 148 148" aria-hidden="true">
      <circle class="track" cx="74" cy="74" r="56" />
      {#if score > 0}
        <circle
          class="arc"
          cx="74"
          cy="74"
          r="56"
          pathLength="100"
          transform="rotate(90 74 74)"
        />
        <circle
          class="arc"
          cx="74"
          cy="74"
          r="56"
          pathLength="100"
          transform="translate(148 0) scale(-1 1) rotate(90 74 74)"
        />
      {/if}
    </svg>

    <span class="face face-you">
      <UserAvatar {user} linked={false} />
    </span>
    <span class="face face-them">
      <UserAvatar user={profile} linked={false} />
    </span>

    <div class="readout" role="img" aria-label={`${score}%`}>
      <span class="score" aria-hidden="true"></span>
      <span class="suffix" aria-hidden="true">%</span>
    </div>
  </div>

  <p class="label">{label}</p>
  <p class="caption">{m.match_drawer_overlap_caption()}</p>
</div>

<style lang="scss">
  @property --match-hero-sweep {
    syntax: "<number>";
    inherits: true;
    initial-value: 0;
  }

  @property --match-hero-count {
    syntax: "<integer>";
    inherits: true;
    initial-value: 0;
  }

  .trakt-match-hero {
    --hero-ink: var(--color-text-primary);
    --hero-ink-muted: var(--color-text-secondary);
    --hero-base: var(--color-background);
    --face-size: var(--ni-36);
    --face-radius: var(--ni-56);

    position: relative;
    isolation: isolate;
    container-type: inline-size;

    box-sizing: border-box;
    height: var(--ni-284);
    padding: var(--ni-28) var(--ni-16) 0;

    display: flex;
    flex-direction: column;
    align-items: center;

    border-radius: var(--border-radius-xxl);
    overflow: hidden;

    color: var(--hero-ink);
    background: var(--hero-base);
    box-shadow: 0 var(--ni-8) var(--ni-24)
      color-mix(in srgb, var(--color-shadow) 40%, transparent);
  }

  .cover {
    position: absolute;
    inset: 0;
    z-index: -1;
    overflow: hidden;

    > * {
      position: absolute;
    }
  }

  .halftone {
    inset: 0;
    mask-image: radial-gradient(circle at center, #000 1.7px, transparent 2.3px);
    mask-size: 6px 6px;

    :global(img) {
      position: absolute;
      inset-inline-start: var(--ni-neg-20);
      inset-block-start: var(--ni-neg-200);
      width: calc(100% + var(--ni-40));
      aspect-ratio: 2 / 3;
      object-fit: cover;
      filter: grayscale(1) contrast(1.15);
    }

    @media (prefers-reduced-motion: no-preference) {
      animation: match-hero-ink 900ms ease-out both;

      :global(img) {
        animation: match-hero-drift 16s ease-in-out 1400ms infinite alternate;
      }
    }
  }

  .cover > :global(.tint) {
    position: absolute;
    inset: var(--ni-neg-40);
    width: calc(100% + var(--ni-80));
    height: calc(100% + var(--ni-80));
    object-fit: cover;
    filter: blur(var(--ni-32)) saturate(1.6);
    mix-blend-mode: color;
  }

  .print {
    display: none;

    @media (prefers-reduced-motion: no-preference) {
      display: block;
      inset-block: 0;
      left: 0;
      width: 250%;
      background: linear-gradient(
        90deg,
        transparent 40%,
        var(--hero-base) 60%
      );
      animation: match-hero-print 1200ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }
  }

  .sheen {
    inset-block: 0;
    left: 0;
    width: 300%;
    background: linear-gradient(
      115deg,
      transparent 35%,
      color-mix(in srgb, var(--shade-10) 16%, transparent) 50%,
      transparent 65%
    );
    transform: translateX(-66.7%);

    @media (prefers-reduced-motion: no-preference) {
      animation: match-hero-sheen 1100ms ease-out 900ms both;
    }
  }

  .wash {
    inset: 0;
    background: color-mix(in srgb, var(--hero-base) 45%, transparent);
  }

  .plate {
    inset-block-start: var(--ni-22);
    inset-inline-start: calc(50% - var(--ni-80));
    width: var(--ni-160);
    height: var(--ni-160);
    border-radius: 50%;
    background: color-mix(in srgb, var(--hero-base) 84%, transparent);
    box-shadow: 0 0 0 var(--ni-10)
      color-mix(in srgb, var(--hero-base) 38%, transparent);
  }

  .fade {
    inset-inline: 0;
    inset-block-end: 0;
    height: var(--ni-120);
    background: linear-gradient(
      180deg,
      transparent,
      color-mix(in srgb, var(--hero-base) 92%, transparent) 62%
    );
  }

  .ring {
    --match-hero-sweep: var(--match-hero-sweep-end);
    --match-hero-count: var(--match-hero-score);
    --face-angle: calc(var(--match-hero-sweep) * 1deg);

    position: relative;
    flex: none;
    width: var(--ni-148);
    height: var(--ni-148);

    @media (prefers-reduced-motion: no-preference) {
      animation:
        match-hero-sweep 950ms cubic-bezier(0.2, 0.8, 0.2, 1) 250ms backwards,
        match-hero-count 950ms cubic-bezier(0.2, 0.8, 0.2, 1) 250ms backwards;
    }

    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
  }

  .track,
  .arc {
    fill: none;
    stroke-width: 6;
  }

  .track {
    stroke: color-mix(in srgb, var(--hero-ink) 18%, transparent);
  }

  .arc {
    stroke: var(--hero-ink);
    stroke-linecap: round;
    stroke-dasharray: 100 100;
    stroke-dashoffset: calc(100 - var(--match-hero-sweep) / 3.6);
  }

  .face {
    --face-reach: calc(var(--face-radius) * sin(var(--face-angle)));
    --face-drop: calc(var(--face-radius) * cos(var(--face-angle)));

    position: absolute;
    display: block;
    width: var(--face-size);
    height: var(--face-size);
    border-radius: 50%;
    box-shadow: 0 0 0 var(--ni-3) var(--hero-base);

    inset-block-start: calc(50% - var(--face-size) / 2);
    inset-inline-start: calc(50% - var(--face-size) / 2);

    :global(.trakt-user-avatar) {
      width: 100%;
      height: 100%;
    }
  }

  .face-you {
    transform: translate(
      calc(var(--face-reach) * var(--rtl-sign) * -1),
      var(--face-drop)
    );
  }

  .face-them {
    z-index: 1;
    transform: translate(
      calc(var(--face-reach) * var(--rtl-sign)),
      var(--face-drop)
    );
  }

  .readout {
    position: absolute;
    inset: 0;

    display: flex;
    align-items: baseline;
    justify-content: center;
    padding-block-start: calc(50% - var(--ni-18));
    box-sizing: border-box;

    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  .score {
    font-size: var(--ni-36);
    font-weight: 700;

    &::after {
      content: counter(match-hero-count);
      counter-reset: match-hero-count var(--match-hero-count);
    }
  }

  .suffix {
    margin-inline-start: var(--ni-2);
    font-size: var(--font-size-text-small);
    color: var(--hero-ink-muted);
  }

  .label {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;

    margin-top: var(--ni-12);
    height: var(--ni-52);
    max-width: 100%;

    font-size: min(var(--ni-48), calc(100cqi / (var(--label-length) * 0.58)));
    line-height: var(--ni-52);
    font-weight: 700;
    letter-spacing: -0.025em;
    white-space: nowrap;

    @media (prefers-reduced-motion: no-preference) {
      animation: match-hero-title 700ms cubic-bezier(0.2, 0.8, 0.2, 1) 550ms
        backwards;
    }
  }

  .caption {
    margin-top: var(--ni-6);
    font-size: var(--font-size-text-small);
    line-height: var(--ni-14);
    letter-spacing: 0.02em;
    color: var(--hero-ink-muted);
  }

  @keyframes match-hero-ink {
    from {
      opacity: 0;
    }
  }

  @keyframes match-hero-print {
    from {
      transform: translateX(-60%);
    }
  }

  @keyframes match-hero-drift {
    from {
      transform: translate(0, 0) scale(1.03);
    }

    to {
      transform: translate(var(--ni-neg-12), var(--ni-10)) scale(1.08);
    }
  }

  @keyframes match-hero-sheen {
    from {
      transform: translateX(0);
    }
  }

  @keyframes match-hero-sweep {
    from {
      --match-hero-sweep: 0;
    }
  }

  @keyframes match-hero-count {
    from {
      --match-hero-count: 0;
    }
  }

  @keyframes match-hero-title {
    from {
      opacity: 0;
      transform: scale(1.08);
    }
  }
</style>
