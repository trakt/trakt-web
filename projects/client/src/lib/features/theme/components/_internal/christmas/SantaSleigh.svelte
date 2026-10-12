<script lang="ts">
  const { delaySeconds = 4 }: { delaySeconds?: number } = $props();

  const reindeer = [
    { key: "dasher", x: 58, hasNose: false, delay: 0.12 },
    { key: "rudolph", x: 112, hasNose: true, delay: 0 },
  ];

  const sparkles = Array.from({ length: 7 }, (_, index) => ({
    key: index,
    x: -6 - index * 6,
    y: 22 + Math.sin(index * 1.3) * 4,
    size: 1.4 - index * 0.15,
    delay: index * 0.12,
  }));
</script>

<div
  class="trakt-santa-sleigh"
  style="--sleigh-delay: {delaySeconds}s"
  aria-hidden="true"
>
  <svg class="sleigh-team" viewBox="-48 -14 222 52">
    {#each sparkles as sparkle (sparkle.key)}
      <circle
        class="sleigh-sparkle"
        cx={sparkle.x}
        cy={sparkle.y}
        r={sparkle.size}
        style="--sparkle-delay: {sparkle.delay}s"
      />
    {/each}

    <path class="sleigh-reins" d="M36 5Q90 16 158 9M36 5Q70 12 104 9" />

    {#each reindeer as deer (deer.key)}
      <g transform="translate({deer.x} 0)">
        <g class="sleigh-reindeer" style="--gallop-delay: {deer.delay}s">
          <ellipse
            cx="26"
            cy="20"
            rx="14"
            ry="5.4"
            transform="rotate(-6 26 20)"
          />
          <path class="deer-neck" d="M37 18Q43 14 45 8" />
          <ellipse
            cx="48"
            cy="7.4"
            rx="4.6"
            ry="2.6"
            transform="rotate(18 48 7.4)"
          />
          <path
            class="deer-antler"
            d="M45 5L42-1 39-4M42-1L44-5M43.6 2L39.6.4M47 5V-1L45-4M47-1L50-4"
          />
          <path
            class="deer-leg"
            d="M36 22L43 26 49 25M33 23L39 29 45 30M18 22L10 26 4 24M21 23L14 29 8 30M13 17L9 14"
          />
          {#if deer.hasNose}
            <circle class="deer-nose" cx="52.6" cy="8.8" r="1.7" />
          {/if}
        </g>
      </g>
    {/each}

    <g class="sleigh-body">
      <path d="M8 10C6 4 10 0 14 2c2 4 1 8-1 10z" />
      <path d="M13 16c0-8 3-12 8-12s7 4 7 12z" />
      <circle cx="21" cy="1" r="3.2" />
      <path d="M18-1c0-5 4-7 8-5l3 3c-2-1-4-1-5 1z" />
      <circle cx="29.4" cy="-2.4" r="1.2" />
      <path class="sleigh-arm" d="M24 8L36 5" />
      <path
        d="M4 0C2 0 1 3 3 4l5 18h26c6 0 10-4 12-8 1-2-1-4-3-2-2 2-5 4-9 4H12L9 2C8.4.6 6 0 4 0z"
      />
      <path class="sleigh-runner" d="M0 28h38c8 0 12-6 8-9M10 22v6M30 22v6" />
    </g>
  </svg>
</div>

<style>
  .trakt-santa-sleigh {
    position: fixed;
    top: 14vh;
    inset-inline-start: 0;

    width: var(--ni-200);
    height: var(--ni-48);

    color: var(--sleigh-color, var(--color-seasonal-silhouette));

    pointer-events: none;
    z-index: var(--layer-floating);

    transform: translateX(calc(var(--rtl-sign) * -30vw));
    animation: sleigh-flight 34s linear var(--sleigh-delay) infinite;

    .sleigh-team {
      width: 100%;
      height: 100%;
      transform: scaleX(var(--rtl-sign));
      overflow: visible;

      fill: currentColor;
    }

    .sleigh-reins {
      fill: none;
      stroke: currentColor;
      stroke-width: 0.6;
    }

    .deer-neck {
      fill: none;
      stroke: currentColor;
      stroke-width: 4.4;
      stroke-linecap: round;
    }

    .deer-antler,
    .deer-leg,
    .sleigh-arm,
    .sleigh-runner {
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .deer-antler {
      stroke-width: 1.2;
    }

    .deer-leg,
    .sleigh-arm {
      stroke-width: 2.2;
    }

    .sleigh-runner {
      stroke-width: 1.8;
    }

    .deer-nose {
      fill: var(--red-400);
      filter: drop-shadow(0 0 var(--ni-4) var(--red-400));
      animation: nose-glow 0.9s ease-in-out infinite alternate;
    }

    .sleigh-reindeer {
      animation: reindeer-gallop 0.5s ease-in-out var(--gallop-delay) infinite
        alternate;
    }

    .sleigh-sparkle {
      fill: var(--yellow-200);
      animation: sparkle-fade 0.9s ease-in-out var(--sparkle-delay) infinite
        alternate;
    }
  }

  @keyframes sleigh-flight {
    0% {
      transform: translate(calc(var(--rtl-sign) * -30vw), 6vh) rotate(calc(var(--rtl-sign) * -6deg));
    }
    10% {
      transform: translate(calc(var(--rtl-sign) * 30vw), -2vh) rotate(calc(var(--rtl-sign) * -2deg));
    }
    20% {
      transform: translate(calc(var(--rtl-sign) * 70vw), 3vh) rotate(calc(var(--rtl-sign) * -4deg));
    }
    30% {
      transform: translate(calc(var(--rtl-sign) * 115vw), -6vh) rotate(calc(var(--rtl-sign) * -8deg));
    }
    100% {
      transform: translate(calc(var(--rtl-sign) * 115vw), -6vh) rotate(calc(var(--rtl-sign) * -8deg));
    }
  }

  @keyframes reindeer-gallop {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(-1 * var(--ni-2)));
    }
  }

  @keyframes nose-glow {
    from {
      opacity: 0.7;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes sparkle-fade {
    from {
      opacity: 0.2;
    }
    to {
      opacity: 1;
    }
  }
</style>
