<script lang="ts">
  const uid = $props.id();

  const lobes = [
    { key: "far-west", cx: 52, cy: 124, rx: 34, ry: 54, tilt: -14 },
    { key: "far-east", cx: 150, cy: 122, rx: 34, ry: 56, tilt: 12 },
    { key: "west", cx: 74, cy: 120, rx: 40, ry: 64, tilt: -6 },
    { key: "east", cx: 128, cy: 119, rx: 40, ry: 65, tilt: 7 },
    { key: "center", cx: 101, cy: 118, rx: 38, ry: 68, tilt: 2 },
  ];

  const CARVING = "translate(58 76) scale(1.35)";
  const WALL_DEPTH = "translate(2 3.4)";
  const MARK = [
    "M56.00 38.95A27.5 27.5 0 1 1 36.19 3.20",
    "M16.93 27.11L35.82 42.96M29.92 34.75L53.89 6.17M56.69 18.31L42.49 35.24M26.88 22.41L23.36 19.45",
  ];
</script>

{#snippet mark(className: string)}
  <g class={className} transform={CARVING}>
    {#each MARK as d (d)}
      <path {d} />
    {/each}
  </g>
{/snippet}

<div class="trakt-halloween-jack-o-lantern">
  <div class="lantern-interior">
    <div class="interior-glow"></div>
    <div class="candle">
      <div class="candle-flame"></div>
      <div class="candle-wax"></div>
    </div>
  </div>

  <svg class="lantern-art" viewBox="0 0 200 200" aria-hidden="true">
    <defs>
      <radialGradient id="{uid}-skin" cx="0.38" cy="0.32" r="0.8">
        <stop offset="0" class="skin-light" />
        <stop offset="0.45" class="skin-mid" />
        <stop offset="1" class="skin-dark" />
      </radialGradient>
      <linearGradient
        id="{uid}-wall"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1="60"
        x2="0"
        y2="176"
      >
        <stop offset="0" class="wall-light" />
        <stop offset="1" class="wall-dark" />
      </linearGradient>
      <mask
        id="{uid}-hole"
        maskUnits="userSpaceOnUse"
        x="-20"
        y="-20"
        width="240"
        height="240"
      >
        <rect x="-20" y="-20" width="240" height="240" fill="white" />
        {@render mark("mask-cut")}
      </mask>
      <mask
        id="{uid}-wall-mask"
        maskUnits="userSpaceOnUse"
        x="-20"
        y="-20"
        width="240"
        height="240"
      >
        <rect x="-20" y="-20" width="240" height="240" fill="white" />
        <g transform={WALL_DEPTH}>
          {@render mark("mask-cut")}
        </g>
      </mask>
    </defs>

    <ellipse class="lantern-shadow" cx="101" cy="184" rx="78" ry="8" />

    <g mask="url(#{uid}-hole)">
      {#each lobes as lobe (lobe.key)}
        <ellipse
          class="lantern-lobe"
          cx={lobe.cx}
          cy={lobe.cy}
          rx={lobe.rx}
          ry={lobe.ry}
          transform="rotate({lobe.tilt} {lobe.cx} {lobe.cy})"
          fill="url(#{uid}-skin)"
        />
      {/each}

      <path
        class="lantern-rib"
        d="M88 58c-10 20-12 92 2 120M114 58c10 22 12 92-2 120M62 74c-10 24-8 72 6 96M140 72c12 26 10 74-4 98"
      />

      {@render mark("carving-edge")}
    </g>

    <g mask="url(#{uid}-wall-mask)">
      <g stroke="url(#{uid}-wall)">
        {@render mark("carving-wall")}
      </g>
    </g>

    <path
      class="lantern-stem"
      d="M95 60c-3-14 0-28 10-38 3-3 8-2 7 2-7 9-9 21-6 36z"
    />
    <path
      class="lantern-vine"
      d="M108 26c8-8 22-8 26 2 3 8-4 15-11 12-6-2-5-10 1-10M98 30c-8-6-20-4-22 4-2 7 5 11 9 7"
    />
    <path class="lantern-leaf" d="M76 34c-6-6-16-4-18 2 6 5 14 5 18-2z" />
  </svg>
</div>

<style>
  .trakt-halloween-jack-o-lantern {
    position: relative;
    width: 100%;
    height: 100%;

    transform-origin: 50% 90%;
    animation: lantern-wobble 6s ease-in-out infinite;

    .lantern-art {
      position: relative;
    }

    .lantern-art {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .skin-light {
      stop-color: var(--orange-300);
    }

    .skin-mid {
      stop-color: var(--orange-500);
    }

    .skin-dark {
      stop-color: var(--orange-800);
    }

    .wall-light {
      stop-color: var(--orange-800);
    }

    .wall-dark {
      stop-color: var(--orange-600);
    }

    .lantern-shadow {
      fill: var(--shade-1000);
      opacity: 0.5;
    }

    .lantern-lobe {
      stroke: var(--shade-1000);
      stroke-width: 2.2;
      stroke-opacity: 0.85;
    }

    .lantern-rib {
      fill: none;
      stroke: var(--orange-800);
      stroke-width: 1.4;
      stroke-linecap: round;
      opacity: 0.45;
    }

    :global(.mask-cut),
    :global(.carving-edge),
    :global(.carving-wall) {
      fill: none;
      stroke-width: 8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    :global(.mask-cut) {
      stroke: black;
    }

    :global(.carving-edge) {
      stroke: var(--orange-900);
      stroke-width: 9.6;
      opacity: 0.9;
    }

    .lantern-stem {
      fill: var(--green-800);
      stroke: var(--shade-1000);
      stroke-width: 2;
    }

    .lantern-vine {
      fill: none;
      stroke: var(--green-600);
      stroke-width: 2.4;
      stroke-linecap: round;
    }

    .lantern-leaf {
      fill: var(--green-700);
    }

    .lantern-interior {
      position: absolute;
      inset: 30% 22% 10%;

      overflow: hidden;
      border-radius: 40%;
      background: radial-gradient(
        ellipse 60% 55% at 50% 72%,
        var(--yellow-300) 0%,
        var(--orange-500) 22%,
        var(--orange-700) 52%,
        var(--orange-900) 82%,
        color-mix(in srgb, var(--orange-900) 50%, var(--shade-1000)) 100%
      );
    }

    .interior-glow {
      position: absolute;
      inset: 0;

      background: radial-gradient(
        circle at 50% 70%,
        var(--yellow-100) 0%,
        var(--yellow-300) 14%,
        transparent 38%
      );

      animation: lantern-flicker 2.6s ease-in-out infinite;
    }

    .candle {
      position: absolute;
      inset-block-end: 6%;
      left: 50%;

      width: 16%;
      height: 46%;

      transform: translateX(-50%);
    }

    .candle-wax {
      position: absolute;
      inset-inline: 0;
      bottom: 0;
      height: 46%;

      border-radius: 18% 18% 8% 8%;
      background: linear-gradient(
        90deg,
        var(--yellow-200),
        var(--yellow-50) 40%,
        var(--orange-200)
      );
    }

    .candle-flame {
      position: absolute;
      inset-inline: 10%;
      bottom: 40%;
      height: 62%;

      border-radius: 50% 50% 50% 50% / 64% 64% 36% 36%;
      background: radial-gradient(
        ellipse at 50% 72%,
        var(--yellow-50) 0%,
        var(--yellow-200) 28%,
        var(--yellow-400) 55%,
        var(--orange-500) 100%
      );
      box-shadow: 0 0 var(--ni-6)
        color-mix(in srgb, var(--orange-400) 60%, transparent);

      transform-origin: 50% 100%;
      animation: flame-dance 1.4s ease-in-out infinite;
    }
  }

  @keyframes lantern-flicker {
    0%,
    100% {
      opacity: 1;
    }
    20% {
      opacity: 0.72;
    }
    24% {
      opacity: 0.94;
    }
    52% {
      opacity: 0.8;
    }
    70% {
      opacity: 1;
    }
    74% {
      opacity: 0.66;
    }
  }

  @keyframes flame-dance {
    0%,
    100% {
      transform: scale(1, 1) rotate(0deg);
    }
    25% {
      transform: scale(0.92, 1.1) rotate(-4deg);
    }
    50% {
      transform: scale(1.06, 0.94) rotate(2deg);
    }
    75% {
      transform: scale(0.96, 1.06) rotate(4deg);
    }
  }

  @keyframes lantern-wobble {
    0%,
    100% {
      transform: rotate(-2deg);
    }
    50% {
      transform: rotate(2.5deg) scaleY(1.02);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-halloween-jack-o-lantern,
    .trakt-halloween-jack-o-lantern .interior-glow,
    .trakt-halloween-jack-o-lantern .candle-flame {
      animation: none;
    }
  }
</style>
