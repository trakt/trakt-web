<script lang="ts" module>
  const farFirs = [
    3, 9, 14, 21, 27, 33, 38, 44, 50, 55, 61, 66, 72, 78, 84, 90, 96,
  ].map((x, index) => ({
    key: `far-${x}`,
    x,
    scale: 0.7 + ((index * 37) % 10) / 25,
  }));

  const midFirs = [
    { key: "mid-a", x: 1, scale: 1.1 },
    { key: "mid-b", x: 8, scale: 0.8 },
    { key: "mid-c", x: 24, scale: 0.9 },
    { key: "mid-d", x: 69, scale: 0.85 },
    { key: "mid-e", x: 76, scale: 1.05 },
    { key: "mid-f", x: 97, scale: 0.9 },
  ];

  const presents = [
    { key: "red", x: 8, width: 15, height: 12, tone: "red" },
    { key: "green", x: 72, width: 13, height: 15, tone: "green" },
    { key: "gold", x: 86, width: 11, height: 9, tone: "gold" },
  ];
</script>

<script lang="ts">
  import SplashScene from "../splash/SplashScene.svelte";
  import ChristmasFir from "./ChristmasFir.svelte";
  import ChristmasLamp from "./ChristmasLamp.svelte";

  const uid = $props.id();
</script>

{#snippet hill(layer: "far" | "mid" | "near", d: string)}
  <svg
    class="hills-layer"
    data-layer={layer}
    viewBox="0 0 400 40"
    preserveAspectRatio="none"
    fill="url(#{uid}-hill-{layer})"
  >
    <defs>
      <linearGradient id="{uid}-hill-{layer}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" class="{layer}-top" />
        <stop offset="1" class="{layer}-bottom" />
      </linearGradient>
    </defs>
    <path {d} />
  </svg>
{/snippet}

<SplashScene height="clamp(var(--ni-120), 26vw, var(--ni-260))">
  <div class="trakt-christmas-hills">
    {@render hill(
      "far",
      "M0 14C60 2 110 4 170 12S290 4 340 6 400 12 400 12V40H0z",
    )}

    {#each farFirs as fir (fir.key)}
      <div
        class="hills-fir"
        data-layer="far"
        style="--fir-x: {fir.x}%; --fir-scale: {fir.scale}"
      >
        <ChristmasFir />
      </div>
    {/each}

    {@render hill("mid", "M0 16C80 4 140 8 200 16S330 6 400 14V40H0z")}

    {#each midFirs as fir (fir.key)}
      <div
        class="hills-fir"
        data-layer="mid"
        style="--fir-x: {fir.x}%; --fir-scale: {fir.scale}"
      >
        <ChristmasFir />
      </div>
    {/each}

    <div class="hills-lamp">
      <ChristmasLamp />
    </div>

    <div class="hills-tree">
      <div class="tree-halo"></div>
      <div class="tree-fir">
        <ChristmasFir isDecorated />
      </div>
      <svg
        class="tree-presents"
        viewBox="0 0 100 20"
        preserveAspectRatio="xMidYMax meet"
      >
        {#each presents as present (present.key)}
          <g class="tree-present" data-tone={present.tone}>
            <rect
              class="present-box"
              x={present.x}
              y={20 - present.height}
              width={present.width}
              height={present.height}
              rx="1"
            />
            <rect
              class="present-shade"
              x={present.x + present.width * 0.6}
              y={20 - present.height}
              width={present.width * 0.4}
              height={present.height}
            />
            <rect
              class="present-ribbon"
              x={present.x + present.width / 2 - 1}
              y={20 - present.height}
              width="2"
              height={present.height}
            />
            <path
              class="present-ribbon"
              d="M{present.x + present.width / 2} {20 -
                present.height}c-4-4-6 0-3 1zm0 0c4-4 6 0 3 1z"
            />
          </g>
        {/each}
      </svg>
    </div>

    {@render hill("near", "M0 20C70 10 150 14 220 22S340 12 400 18V40H0z")}
  </div>
</SplashScene>

<style>
  .trakt-christmas-hills {
    --hills-height: var(--scene-height);
    --snow-night: color-mix(in oklch, var(--blue-200) 45%, var(--shade-400));

    position: absolute;
    inset: 0;

    .hills-layer {
      position: absolute;
      bottom: 0;
      inset-inline: 0;

      width: 100%;

      &[data-layer="far"] {
        height: 48%;
      }

      &[data-layer="mid"] {
        height: 30%;
      }

      &[data-layer="near"] {
        height: 16%;
      }
    }

    .far-top {
      stop-color: var(--snow-night);
    }

    .far-bottom {
      stop-color: color-mix(in oklch, var(--blue-900) 60%, var(--shade-700));
    }

    .mid-top {
      stop-color: color-mix(in oklch, var(--blue-100) 40%, var(--shade-200));
    }

    .mid-bottom {
      stop-color: var(--snow-night);
    }

    .near-top {
      stop-color: var(--shade-10);
    }

    .near-bottom {
      stop-color: color-mix(in oklch, var(--blue-100) 50%, var(--shade-100));
    }

    .hills-fir {
      position: absolute;
      inset-inline-start: var(--fir-x);

      height: calc(var(--hills-height) * var(--fir-height) * var(--fir-scale));
      aspect-ratio: 88 / 120;

      translate: calc(var(--rtl-sign) * -50%) 0;

      &[data-layer="far"] {
        --fir-height: 0.32;
        --fir-color: color-mix(in oklch, var(--green-900) 35%, var(--blue-900));
        --fir-shade-opacity: 0.15;
        --fir-snow-opacity: 0.3;

        bottom: 30%;
      }

      &[data-layer="mid"] {
        --fir-height: 0.55;
        --fir-color: color-mix(in oklch, var(--green-900) 70%, var(--blue-900));
        --fir-snow-opacity: 0.7;

        bottom: 14%;
      }
    }

    .hills-lamp {
      position: absolute;
      bottom: 6%;
      inset-inline-start: 14%;

      height: calc(var(--hills-height) * 0.85);
      aspect-ratio: 40 / 120;
    }

    .hills-tree {
      position: absolute;
      bottom: 6%;
      inset-inline-end: 6%;

      height: calc(var(--hills-height) * 0.98);
      aspect-ratio: 88 / 120;

      .tree-halo {
        position: absolute;
        inset: -30% -60% 0;

        background: radial-gradient(
          ellipse at 50% 60%,
          color-mix(in srgb, var(--yellow-300) 35%, transparent),
          color-mix(in srgb, var(--orange-400) 12%, transparent) 40%,
          transparent 70%
        );

        animation: halo-breathe 4s ease-in-out infinite;
      }

      .tree-fir {
        --fir-color: var(--green-800);

        position: relative;
        height: 100%;
      }

      .tree-presents {
        position: absolute;
        bottom: -2%;
        inset-inline: -40%;

        width: 180%;
        height: 18%;
      }
    }

    .tree-present {
      .present-shade {
        fill: var(--shade-1000);
        opacity: 0.2;
      }

      .present-ribbon {
        fill: var(--yellow-200);
      }

      &[data-tone="red"] .present-box {
        fill: var(--red-500);
      }

      &[data-tone="green"] .present-box {
        fill: var(--green-600);
      }

      &[data-tone="gold"] .present-box {
        fill: var(--shade-10);
      }

      &[data-tone="gold"] .present-ribbon {
        fill: var(--red-500);
      }
    }
  }

  @keyframes halo-breathe {
    0%,
    100% {
      opacity: 0.85;
    }
    50% {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-christmas-hills .tree-halo {
      animation: none;
    }
  }
</style>
