<script lang="ts" module>
  type Point = { x: number; y: number };

  const HEIGHT = 100;
  const WIDTH = 40;
  const TIER_COUNT = 6;
  const TRUNK = 3;

  const toPath = ({ x, y }: Point) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  const mirror = ({ x, y }: Point): Point => ({ x: -x, y });

  const apex: Point = { x: 0, y: -HEIGHT };

  const tiers = Array.from({ length: TIER_COUNT }, (_, index) => {
    const progress = (index + 1) / TIER_COUNT;
    const y = -HEIGHT + (HEIGHT - 8) * progress;
    const width = WIDTH * (0.28 + 0.72 * progress);
    const isLast = index === TIER_COUNT - 1;

    return {
      tip: { x: width, y: y + 3 },
      notch: isLast ? { x: TRUNK, y } : { x: width * 0.4, y: y - 1 },
    };
  });

  const branches = tiers.map((tier, index) => {
    const from = tiers.at(index - 1)?.notch ?? apex;
    const start = index === 0 ? apex : from;

    return {
      ...tier,
      from: start,
      edge: {
        x: (start.x + tier.tip.x) / 2 - 1,
        y: (start.y + tier.tip.y) / 2 + 2.5,
      },
      under: { x: tier.tip.x * 0.72, y: tier.tip.y + 0.5 },
    };
  });

  const lastNotch = branches.at(-1)?.notch ?? apex;

  const rightSide = branches
    .map(
      (branch) =>
        `Q${toPath(branch.edge)} ${toPath(branch.tip)}Q${toPath(branch.under)} ${toPath(branch.notch)}`,
    )
    .join("");

  const leftSideUp = [...branches]
    .reverse()
    .map(
      (branch) =>
        `Q${toPath(mirror(branch.under))} ${toPath(mirror(branch.tip))}Q${toPath(mirror(branch.edge))} ${toPath(mirror(branch.from))}`,
    )
    .join("");

  const leftSideDown = branches
    .map(
      (branch) =>
        `Q${toPath(mirror(branch.edge))} ${toPath(mirror(branch.tip))}Q${toPath(mirror(branch.under))} ${toPath(mirror(branch.notch))}`,
    )
    .join("");

  const FIR_PATH = `M${toPath(apex)}${rightSide}L${TRUNK} 6L${-TRUNK} 6L${toPath(mirror(lastNotch))}${leftSideUp}Z`;
  const SHADE_PATH = `M${toPath(apex)}${leftSideDown}L${-TRUNK} 6L0 6Z`;
  const SNOW_PATH = branches
    .flatMap((branch) => [
      `M${toPath(branch.from)}Q${toPath(branch.edge)} ${toPath(branch.tip)}`,
      `M${toPath(mirror(branch.from))}Q${toPath(mirror(branch.edge))} ${toPath(mirror(branch.tip))}`,
    ])
    .join("");

  const garlands = branches.slice(1).map((branch, index) => {
    const span = branch.tip.x * 0.78;
    const y = branch.tip.y - 5;
    const count = Math.max(2, Math.round(span / 6));

    return {
      key: index,
      path: `M${toPath({ x: -span, y })}Q0 ${(y + 8).toFixed(1)} ${toPath({ x: span, y })}`,
      bulbs: Array.from({ length: count + 1 }, (_, bulb) => {
        const t = bulb / count;

        return {
          key: `${index}-${bulb}`,
          x: -span + 2 * span * t,
          y: y + 4 * (1 - (2 * t - 1) ** 2),
          tone: (bulb + index) % 3,
          delay: ((bulb * 7 + index * 3) % 10) * 0.18,
        };
      }),
    };
  });

  const BULB_TONES = [0, 1, 2] as const;

  const BULBS = garlands.flatMap((garland) => garland.bulbs);
</script>

<script lang="ts">
  const { isDecorated = false }: { isDecorated?: boolean } = $props();
</script>

<svg
  class="trakt-christmas-fir"
  viewBox="-44 -112 88 120"
  preserveAspectRatio="xMidYMax meet"
  aria-hidden="true"
>
  <path class="fir-body" d={FIR_PATH} />
  <path class="fir-shade" d={SHADE_PATH} />
  <path class="fir-snow" d={SNOW_PATH} />

  {#if isDecorated}
    {#each garlands as garland (garland.key)}
      <path class="fir-garland" d={garland.path} />
    {/each}

    {#each BULB_TONES as tone (tone)}
      <g class="fir-bulbs" data-tone={tone}>
        {#each BULBS.filter((bulb) => bulb.tone === tone) as bulb (bulb.key)}
          <circle
            class="fir-bulb"
            cx={bulb.x}
            cy={bulb.y}
            r="1.7"
            style="--bulb-delay: {bulb.delay}s"
          />
        {/each}
      </g>
    {/each}

    <path
      class="fir-star"
      d="M0-111l2.6 5.6 6 .7-4.5 4 1.3 6-5.4-3-5.4 3 1.3-6-4.5-4 6-.7z"
    />
  {/if}
</svg>

<style>
  .trakt-christmas-fir {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;

    .fir-body {
      fill: var(--fir-color, var(--green-900));
    }

    .fir-shade {
      fill: var(--shade-1000);
      opacity: var(--fir-shade-opacity, 0.3);
    }

    .fir-snow {
      fill: none;
      stroke: var(--shade-10);
      stroke-width: 1.3;
      stroke-linecap: round;
      stroke-dasharray: 16 5 6 4;
      opacity: var(--fir-snow-opacity, 0.9);
    }

    .fir-garland {
      fill: none;
      stroke: var(--yellow-200);
      stroke-width: 0.6;
      opacity: 0.6;
    }

    .fir-bulbs {
      fill: var(--yellow-100);
      filter: drop-shadow(0 0 var(--ni-3) var(--yellow-300));

      &[data-tone="1"] {
        fill: var(--red-400);
        filter: drop-shadow(0 0 var(--ni-3) var(--red-400));
      }

      &[data-tone="2"] {
        fill: var(--shade-10);
        filter: none;
      }
    }

    .fir-bulb {
      animation: bulb-twinkle 1.8s ease-in-out var(--bulb-delay) infinite
        alternate;
    }

    .fir-star {
      fill: var(--yellow-200);
      filter: drop-shadow(0 0 var(--ni-8) var(--yellow-300));
      transform-box: fill-box;
      transform-origin: center;
      animation: star-pulse 2.4s ease-in-out infinite;
    }
  }

  @keyframes bulb-twinkle {
    from {
      opacity: 0.45;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes star-pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.15);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-christmas-fir .fir-bulb,
    .trakt-christmas-fir .fir-star {
      animation: none;
    }
  }
</style>
