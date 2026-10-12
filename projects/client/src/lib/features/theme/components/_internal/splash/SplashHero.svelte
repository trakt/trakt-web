<script lang="ts">
  import LogoMarkCircle from "$lib/components/logo/LogoMarkCircle.svelte";
  import type { SeasonalThemeId } from "$lib/features/theme/models/SeasonalThemeId";
  import type { Snippet } from "svelte";
  import SeasonalHat from "../mascots/SeasonalHat.svelte";

  const { themeId, backdrop }: { themeId: SeasonalThemeId; backdrop?: Snippet } =
    $props();
</script>

<div class="trakt-splash-hero" data-season={themeId} aria-hidden="true">
  <div class="hero-glow"></div>

  <div class="hero-backdrop">
    {@render backdrop?.()}
  </div>

  <div class="hero-logo">
    <LogoMarkCircle />
  </div>

  <div class="hero-hat">
    <SeasonalHat {themeId} />
  </div>
</div>

<style>
  .trakt-splash-hero {
    --hero-size: var(--ni-152);
    --hat-size: calc(var(--hero-size) * 1.05);
    --hat-top: calc(var(--hero-size) * -0.62);
    --hat-shift: calc(var(--hero-size) * 0.02);
    --hat-tilt: -10deg;

    position: relative;
    width: var(--hero-size);
    height: var(--hero-size);

    .hero-glow {
      position: absolute;
      inset: calc(var(--hero-size) * -0.9);

      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--purple-400) 55%, transparent) 0%,
        color-mix(in srgb, var(--purple-600) 25%, transparent) 35%,
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

    .hero-logo {
      position: relative;
      width: 100%;
      height: 100%;

      --circle-mark-bg: var(--shade-10);
      --color-foreground: var(--purple-500);

      filter: drop-shadow(0 var(--ni-12) var(--ni-32) var(--shade-1000));

      animation: hero-pop 700ms cubic-bezier(0.34, 1.56, 0.64, 1) 100ms both;

      :global(svg) {
        width: 100%;
        height: 100%;
      }
    }

    .hero-hat {
      position: absolute;
      top: var(--hat-top);
      left: 50%;

      width: var(--hat-size);
      height: var(--hat-size);
      margin-left: calc(var(--hat-size) / -2 + var(--hat-shift));

      transform-origin: center bottom;
      animation:
        hat-drop 800ms cubic-bezier(0.22, 1.2, 0.36, 1) 550ms both,
        hat-sway 5s ease-in-out 1400ms infinite;
    }

    &[data-season="halloween"] {
      --hat-size: calc(var(--hero-size) * 1.2);
      --hat-top: calc(var(--hero-size) * -0.78);
      --hat-tilt: -8deg;
    }

    &[data-season="christmas"] {
      --hat-size: calc(var(--hero-size) * 1.15);
      --hat-top: calc(var(--hero-size) * -0.6);
      --hat-shift: calc(var(--hero-size) * 0.08);
      --hat-tilt: -6deg;
    }

    &[data-season="new-year"] {
      --hat-size: calc(var(--hero-size) * 0.7);
      --hat-top: calc(var(--hero-size) * -0.6);
      --hat-tilt: 14deg;
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
      transform: scale(0.3);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes hat-drop {
    0% {
      opacity: 0;
      transform: translateY(-60vh) rotate(calc(var(--hat-tilt) * -2));
    }
    60% {
      opacity: 1;
      transform: translateY(0) rotate(var(--hat-tilt)) scale(1.08, 0.88);
    }
    80% {
      transform: translateY(calc(-1 * var(--ni-8))) rotate(var(--hat-tilt))
        scale(0.97, 1.03);
    }
    100% {
      opacity: 1;
      transform: translateY(0) rotate(var(--hat-tilt));
    }
  }

  @keyframes hat-sway {
    0%,
    100% {
      transform: rotate(var(--hat-tilt));
    }
    50% {
      transform: rotate(calc(var(--hat-tilt) + 4deg));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-splash-hero .hero-glow,
    .trakt-splash-hero .hero-logo,
    .trakt-splash-hero .hero-hat {
      animation: none;
    }

    .trakt-splash-hero .hero-hat {
      transform: rotate(var(--hat-tilt));
    }
  }
</style>
