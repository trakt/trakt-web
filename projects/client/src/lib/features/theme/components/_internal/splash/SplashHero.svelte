<script lang="ts">
  import type { SeasonalThemeId } from "$lib/features/theme/models/SeasonalThemeId";
  import type { Snippet } from "svelte";

  const {
    themeId,
    backdrop,
    emblem,
  }: { themeId: SeasonalThemeId; backdrop?: Snippet; emblem: Snippet } =
    $props();
</script>

<div class="trakt-splash-hero" data-season={themeId} aria-hidden="true">
  <div class="hero-glow"></div>

  <div class="hero-backdrop">
    {@render backdrop?.()}
  </div>

  <div class="hero-emblem">
    {@render emblem()}
  </div>
</div>

<style>
  .trakt-splash-hero {
    --hero-size: min(var(--ni-152), 24vh);
    --hero-glow-color: var(--purple-400);
    --hero-glow-edge: var(--purple-600);

    position: relative;
    width: var(--hero-size);
    height: var(--hero-size);

    &[data-season="halloween"] {
      --hero-size: min(var(--ni-176), 26vh);
      --hero-glow-color: var(--orange-400);
      --hero-glow-edge: var(--orange-700);
    }

    &[data-season="christmas"] {
      --hero-size: min(var(--ni-160), 24vh);
      --hero-glow-color: var(--red-400);
      --hero-glow-edge: var(--yellow-600);
    }

    &[data-season="new-year"] {
      --hero-size: min(var(--ni-176), 26vh);
      --hero-glow-color: var(--yellow-400);
      --hero-glow-edge: var(--orange-700);
    }

    .hero-glow {
      position: absolute;
      inset: calc(var(--hero-size) * -0.9);

      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--hero-glow-color) 45%, transparent) 0%,
        color-mix(in srgb, var(--hero-glow-edge) 20%, transparent) 35%,
        transparent 68%
      );

      animation:
        hero-fade 900ms ease-out both,
        hero-glow-pulse 4s ease-in-out 900ms infinite;
    }

    .hero-backdrop {
      position: absolute;
      inset: 0;

      display: grid;
      grid-template: 100% / 100%;
      place-items: unsafe center;

      pointer-events: none;
    }

    .hero-emblem {
      position: relative;
      width: 100%;
      height: 100%;

      filter: drop-shadow(0 var(--ni-12) var(--ni-32) var(--shade-1000));

      animation: hero-pop 800ms cubic-bezier(0.34, 1.56, 0.64, 1) 150ms both;
    }
  }

  @keyframes hero-fade {
    from {
      opacity: 0;
      transform: scale(0.6);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes hero-glow-pulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.08);
    }
  }

  @keyframes hero-pop {
    from {
      opacity: 0;
      transform: scale(0.3) rotate(-8deg);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-splash-hero .hero-glow,
    .trakt-splash-hero .hero-emblem {
      animation: none;
    }
  }
</style>
