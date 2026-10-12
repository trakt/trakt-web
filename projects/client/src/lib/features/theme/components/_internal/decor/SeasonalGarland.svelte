<script lang="ts" module>
  const ornaments = Array.from({ length: 16 }, (_, index) => index);
  const bulbs = ornaments.map((index) => ({
    key: index,
    tone: (index * 3) % 5,
    duration: 1.6 + ((index * 7) % 5) * 0.35,
    tilt: ((index * 5) % 7) - 3,
  }));
  const pennants = ornaments.map((index) => ({
    key: index,
    tone: index % 3,
    hasStar: index % 2 === 1,
    drop: (index * 7) % 4,
  }));
  const sparkles = [
    { key: 0, shift: 20, size: 0.7, delay: -1.3, duration: 2.1 },
    { key: 1, shift: -35, size: 0.5, delay: -0.2, duration: 1.7 },
    { key: 3, shift: 10, size: 0.85, delay: -2.4, duration: 2.6 },
    { key: 4, shift: -15, size: 0.55, delay: -0.9, duration: 1.9 },
    { key: 6, shift: 30, size: 0.65, delay: -1.8, duration: 2.3 },
    { key: 7, shift: -25, size: 0.9, delay: -0.4, duration: 2.8 },
    { key: 9, shift: 5, size: 0.5, delay: -2.1, duration: 1.6 },
    { key: 10, shift: 35, size: 0.75, delay: -1.1, duration: 2.4 },
    { key: 12, shift: -30, size: 0.6, delay: -2.7, duration: 2 },
    { key: 13, shift: 15, size: 0.8, delay: -0.6, duration: 2.5 },
    { key: 15, shift: -10, size: 0.55, delay: -1.6, duration: 1.8 },
  ];
  const wire = ornaments
    .map((index) => `M${index * 10} 0Q${index * 10 + 5} 6 ${index * 10 + 10} 0`)
    .join("");
</script>

<script lang="ts">
  const { variant }: { variant: "lights" | "bunting" | "sparkle" } = $props();
</script>

<div class="trakt-seasonal-garland" data-variant={variant} aria-hidden="true">
  <svg class="garland-wire" viewBox="0 0 160 8" preserveAspectRatio="none">
    <path class="wire-strand" d={wire} />
    <path class="wire-twist" d={wire} />
  </svg>

  <div class="garland-ornaments">
    {#if variant === "lights"}
      {#each bulbs as bulb (bulb.key)}
        <span
          class="garland-ornament"
          data-tone={bulb.tone}
          style="--ornament-index: {bulb.key}; --bulb-duration: {bulb.duration}s; --bulb-tilt: {bulb.tilt}deg"
        ></span>
      {/each}
    {:else if variant === "sparkle"}
      {#each sparkles as sparkle (sparkle.key)}
        <span
          class="garland-ornament"
          style="--sparkle-column: {sparkle.key +
            1}; --sparkle-shift: {sparkle.shift}%; --sparkle-size: {sparkle.size}; --sparkle-delay: {sparkle.delay}s; --sparkle-duration: {sparkle.duration}s"
        >
          <svg viewBox="-10 -10 20 20">
            <path
              d="M0-10C1-2 2-1 10 0 2 1 1 2 0 10-1 2-2 1-10 0-2-1-1-2 0-10z"
            />
          </svg>
        </span>
      {/each}
    {:else}
      {#each pennants as pennant (pennant.key)}
        <span
          class="garland-ornament"
          data-tone={pennant.tone}
          style="--ornament-index: {pennant.key}; --star-drop-step: {pennant.drop}"
        >
          <span class="pennant-flag"></span>
          {#if pennant.hasStar}
            <span class="pennant-star">
              <svg viewBox="-10 -10 20 20">
                <path
                  d="M0-9l2.6 5.6 6 .7-4.5 4 1.3 6L0 4.4l-5.4 2.9 1.3-6-4.5-4 6-.7z"
                />
              </svg>
            </span>
          {/if}
        </span>
      {/each}
    {/if}
  </div>
</div>

<style>
  .trakt-seasonal-garland {
    --garland-height: var(--ni-16);
    --ornament-sag: calc(var(--garland-height) * 3 / 8);

    position: fixed;
    top: env(safe-area-inset-top, 0);
    inset-inline: 0;
    height: var(--garland-height);

    pointer-events: none;
    z-index: var(--layer-floating);

    .garland-wire {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;

      fill: none;
      stroke: var(--color-seasonal-silhouette);
      stroke-width: 1.5;

      path {
        vector-effect: non-scaling-stroke;
      }
    }

    .garland-ornaments {
      display: grid;
      grid-template-columns: repeat(16, 1fr);
      justify-items: center;

      padding-top: calc(var(--ornament-sag) - var(--ni-2));
    }

    .garland-ornament {
      --ornament-delay: calc(var(--ornament-index) * -0.37s);

      display: block;
      transform-origin: center top;
    }

    &[data-variant="lights"] {
      --garland-height: var(--ni-14);

      .wire-strand {
        stroke: color-mix(
          in oklch,
          var(--green-900) 55%,
          var(--color-seasonal-silhouette)
        );
        stroke-width: 2.4;
      }

      .wire-twist {
        stroke: var(--green-700);
        stroke-width: 1;
        stroke-dasharray: 2 3;
      }
    }

    &[data-variant="lights"] .garland-ornament {
      position: relative;

      width: var(--ni-6);
      height: var(--ni-10);
      margin-top: var(--ni-2);

      color: var(--red-400);
      background: radial-gradient(
        circle at 35% 30%,
        color-mix(in srgb, var(--shade-10) 85%, currentColor) 0 14%,
        currentColor 48%,
        color-mix(in srgb, currentColor 65%, var(--shade-1000)) 100%
      );
      border-radius: 50% 50% 50% 50% / 38% 38% 62% 62%;

      transform: rotate(var(--bulb-tilt));
      animation: bulb-glow var(--bulb-duration) ease-in-out infinite alternate;
      animation-delay: var(--ornament-delay);

      &::before {
        content: "";
        position: absolute;
        top: calc(-1 * var(--ni-2));
        left: 50%;
        transform: translateX(-50%);

        width: var(--ni-3);
        height: var(--ni-3);

        background: linear-gradient(
          90deg,
          var(--shade-700),
          var(--shade-300) 45%,
          var(--shade-800)
        );
        border-radius: var(--ni-1) var(--ni-1) 0 0;
      }

      &::after {
        content: "";
        position: absolute;
        inset: calc(-1 * var(--ni-6));
        z-index: -1;

        background: radial-gradient(
          circle at 50% 55%,
          color-mix(in srgb, currentColor 70%, transparent) 0,
          transparent 65%
        );
        opacity: 0.45;
      }

      &[data-tone="1"] {
        color: var(--green-400);
      }

      &[data-tone="2"] {
        color: var(--yellow-300);
      }

      &[data-tone="3"] {
        color: var(--blue-400);
      }

      &[data-tone="4"] {
        color: var(--orange-300);
      }
    }

    &[data-variant="sparkle"] .garland-ornament {
      grid-column: var(--sparkle-column);

      width: calc(var(--ni-14) * var(--sparkle-size));
      height: calc(var(--ni-14) * var(--sparkle-size));
      margin-top: calc(var(--ni-14) * var(--sparkle-size) * -0.5 + var(--ni-2));
      translate: var(--sparkle-shift) 0;

      fill: var(--yellow-50);
      filter: drop-shadow(0 0 var(--ni-3) var(--yellow-300));

      animation: sparkle-twinkle var(--sparkle-duration) ease-in-out infinite
        alternate;
      animation-delay: var(--sparkle-delay);

      svg {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    &[data-variant="bunting"],
    &[data-variant="sparkle"] {
      --garland-height: var(--ni-20);

      .wire-strand {
        stroke: var(--purple-400);
        stroke-width: 1.6;
      }

      .wire-twist {
        stroke: var(--purple-100);
        stroke-width: 0.8;
        stroke-dasharray: 1.4 2.6;
      }
    }

    &[data-variant="bunting"] .garland-ornament {
      --flag-light: var(--purple-100);
      --flag-base: var(--purple-300);
      --flag-dark: var(--purple-600);

      position: relative;

      animation: flag-sway 3.2s ease-in-out infinite alternate;
      animation-delay: var(--ornament-delay);

      --star-drop: calc(var(--ni-10) + var(--ni-6) * var(--star-drop-step, 0));

      &[data-tone="1"] {
        --flag-light: var(--shade-10);
        --flag-base: var(--shade-200);
        --flag-dark: var(--shade-500);
      }

      &[data-tone="2"] {
        --flag-light: var(--purple-200);
        --flag-base: var(--purple-500);
        --flag-dark: var(--purple-800);
      }

      .pennant-flag {
        position: relative;
        display: block;

        width: var(--ni-16);
        height: var(--ni-20);

        clip-path: polygon(0 0, 100% 0, 100% 62%, 50% 100%, 0 62%);
        filter: drop-shadow(0 var(--ni-2) var(--ni-2) var(--shade-1000));

        &::before {
          content: "";

          position: absolute;
          inset-block: 0;
          left: 0;
          width: 300%;

          background: linear-gradient(
            115deg,
            var(--flag-dark) 0%,
            var(--flag-base) 30%,
            var(--flag-light) 45%,
            var(--flag-base) 60%,
            var(--flag-dark) 100%
          );

          animation: flag-shimmer 4s ease-in-out infinite;
          animation-delay: calc(var(--ornament-index) * 0.15s);
        }
      }

      .pennant-star {
        position: absolute;
        top: calc(100% - var(--ni-4));
        left: 50%;

        width: var(--ni-16);
        height: calc(var(--star-drop) + var(--ni-16));

        transform: translateX(-50%);
        transform-origin: center top;
        animation: star-swing 2.6s ease-in-out infinite alternate;
        animation-delay: var(--ornament-delay);

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;

          width: var(--ni-1);
          height: var(--star-drop);

          background: var(--purple-200);
          opacity: 0.6;
        }

        svg {
          position: absolute;
          bottom: 0;
          left: 0;

          width: var(--ni-16);
          height: var(--ni-16);

          fill: var(--purple-200);
          filter: drop-shadow(0 0 var(--ni-4) var(--purple-300));

          animation: star-twinkle 1.8s ease-in-out infinite alternate;
          animation-delay: var(--ornament-delay);
        }
      }
    }
  }

  @keyframes sparkle-twinkle {
    from {
      opacity: 0.25;
      scale: 0.6;
    }
    to {
      opacity: 1;
      scale: 1;
    }
  }

  @keyframes bulb-glow {
    from {
      filter: brightness(0.75) saturate(0.9);
    }
    to {
      filter: brightness(1.2) saturate(1.1);
    }
  }

  @keyframes flag-shimmer {
    0%,
    100% {
      transform: translateX(-66.667%);
    }
    50% {
      transform: translateX(0);
    }
  }

  @keyframes star-swing {
    from {
      transform: translateX(-50%) rotate(-8deg);
    }
    to {
      transform: translateX(-50%) rotate(8deg);
    }
  }

  @keyframes star-twinkle {
    from {
      opacity: 0.6;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  @keyframes flag-sway {
    from {
      transform: rotate(-6deg);
    }
    to {
      transform: rotate(6deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-seasonal-garland[data-variant] .garland-ornament,
    .trakt-seasonal-garland[data-variant]
      .garland-ornament
      .pennant-flag::before,
    .trakt-seasonal-garland[data-variant] .garland-ornament .pennant-star,
    .trakt-seasonal-garland[data-variant] .garland-ornament .pennant-star svg {
      animation: none;
    }
  }
</style>
