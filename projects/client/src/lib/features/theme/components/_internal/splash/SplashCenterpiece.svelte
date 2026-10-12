<script lang="ts">
  import type { SplashCenterpieceProps } from "./SplashCenterpieceProps.ts";

  const { themeId, backdrop, emblem }: SplashCenterpieceProps = $props();
</script>

<div class="trakt-splash-centerpiece" data-season={themeId} aria-hidden="true">
  <div class="centerpiece-glow"></div>

  <div class="centerpiece-backdrop">
    {@render backdrop?.()}
  </div>

  <div class="centerpiece-emblem">
    {@render emblem()}
  </div>
</div>

<style>
  .trakt-splash-centerpiece {
    --centerpiece-size: min(var(--ni-152), 24vh);
    --centerpiece-glow-color: var(--purple-400);
    --centerpiece-glow-edge: var(--purple-600);

    position: relative;
    width: var(--centerpiece-size);
    height: var(--centerpiece-size);

    &[data-season="halloween"] {
      --centerpiece-size: min(var(--ni-176), 26vh, 25vw);
      --centerpiece-glow-color: var(--orange-400);
      --centerpiece-glow-edge: var(--orange-700);
    }

    &[data-season="christmas"] {
      --centerpiece-size: min(var(--ni-160), 24vh);
      --centerpiece-glow-color: var(--red-400);
      --centerpiece-glow-edge: var(--yellow-600);
    }

    &[data-season="new-year"] {
      --centerpiece-size: min(var(--ni-176), 26vh);
      --centerpiece-glow-color: var(--yellow-400);
      --centerpiece-glow-edge: var(--orange-700);
    }

    .centerpiece-glow {
      position: absolute;
      inset: calc(var(--centerpiece-size) * -0.9);

      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--centerpiece-glow-color) 45%, transparent) 0%,
        color-mix(in srgb, var(--centerpiece-glow-edge) 20%, transparent) 35%,
        transparent 68%
      );

      animation:
        centerpiece-fade 900ms ease-out both,
        centerpiece-glow-pulse 4s ease-in-out 900ms infinite;
    }

    .centerpiece-backdrop {
      position: absolute;
      inset: 0;

      display: grid;
      grid-template: 100% / 100%;
      place-items: unsafe center;

      pointer-events: none;
    }

    .centerpiece-emblem {
      position: relative;
      width: 100%;
      height: 100%;

      filter: drop-shadow(0 var(--ni-12) var(--ni-32) var(--shade-1000));

      animation: centerpiece-pop 800ms cubic-bezier(0.34, 1.56, 0.64, 1) 150ms
        both;
    }
  }

  @keyframes centerpiece-fade {
    from {
      opacity: 0;
      transform: scale(0.6);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes centerpiece-glow-pulse {
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

  @keyframes centerpiece-pop {
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
    .trakt-splash-centerpiece .centerpiece-glow,
    .trakt-splash-centerpiece .centerpiece-emblem {
      animation: none;
    }
  }
</style>
