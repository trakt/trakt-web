<script lang="ts" module>
  type Roof = "flat" | "antenna" | "stepped" | "spire" | "dome";

  type Building = {
    key: string;
    x: number;
    width: number;
    height: number;
    roof: Roof;
  };

  type RowConfig = {
    layer: string;
    seed: number;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
  };

  const WIDTH = 1600;
  const GROUND = 120;
  const ROOFS: ReadonlyArray<Roof> = [
    "flat",
    "antenna",
    "flat",
    "stepped",
    "spire",
    "flat",
    "dome",
  ];

  const noise = (seed: number) => {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  };

  const between = (seed: number, min: number, max: number) =>
    min + noise(seed) * (max - min);

  function buildRow(config: RowConfig): ReadonlyArray<Building> {
    const count = Math.ceil(WIDTH / config.minWidth);
    const widths = Array.from({ length: count }, (_, index) =>
      between(config.seed + index, config.minWidth, config.maxWidth)
    );
    const offsets = widths.reduce<ReadonlyArray<number>>(
      (acc, width) => [...acc, (acc.at(-1) ?? -20) + width],
      [],
    );

    return widths
      .map((width, index) => {
        const x = index === 0 ? -20 : (offsets.at(index - 1) ?? -20);
        const centerDistance = Math.abs(x + width / 2 - 800) / 800;
        const isCenter = centerDistance < 0.08;

        return {
          key: `${config.layer}-${index}`,
          x,
          width: width - 2,
          height: between(
            config.seed * 3 + index,
            config.minHeight,
            isCenter ? config.minHeight * 1.2 : config.maxHeight,
          ),
          roof: ROOFS.at(
            Math.floor(noise(config.seed * 7 + index) * ROOFS.length),
          ) ?? "flat",
        };
      })
      .filter((building) => building.x < WIDTH);
  }

  function roofShape({ x, width, height, roof }: Building) {
    const top = GROUND - height;
    const body = `M${x} ${GROUND}V${top}H${x + width}V${GROUND}Z`;

    switch (roof) {
      case "stepped":
        return `${body}M${x + width * 0.15} ${top}v-7h${width * 0.7}v7zM${
          x + width * 0.32
        } ${top - 7}v-6h${width * 0.36}v6z`;
      case "spire":
        return `${body}M${x + width * 0.25} ${top}L${x + width / 2} ${
          top - width * 0.9
        }L${x + width * 0.75} ${top}z`;
      case "dome":
        return `${body}M${x + width * 0.2} ${top}a${width * 0.3} ${
          width * 0.3
        } 0 0 1 ${width * 0.6} 0z`;
      default:
        return body;
    }
  }

  function windowsFor(buildings: ReadonlyArray<Building>, seed: number) {
    return buildings.flatMap((building, buildingIndex) => {
      const columns = Math.max(1, Math.floor((building.width - 6) / 7));
      const rows = Math.max(0, Math.floor((building.height - 12) / 9));
      const inset = (building.width - (columns * 7 - 3.6)) / 2;

      return Array.from({ length: rows * columns }, (_, cell) => {
        const row = Math.floor(cell / columns);
        const column = cell % columns;
        const roll = noise(seed + buildingIndex * 131 + cell * 17);

        return {
          key: `${building.key}-${cell}`,
          x: building.x + inset + column * 7,
          y: GROUND - building.height + 8 + row * 9,
          isLit: roll > 0.42,
          isFlickering: roll > 0.97,
          tone: Math.floor(roll * 30) % 3,
        };
      }).filter((light) => light.isLit);
    });
  }

  type Window = ReturnType<typeof windowsFor>[number];

  const windowPath = (light: Window) =>
    `M${light.x.toFixed(2)} ${light.y.toFixed(2)}h3.4v4.6h-3.4z`;

  const TONES = [0, 1, 2] as const;

  const staticWindowPaths = (windows: ReadonlyArray<Window>) =>
    TONES.map((tone) => ({
      tone,
      path: windows
        .filter((light) => !light.isFlickering && light.tone === tone)
        .map(windowPath)
        .join(""),
    }));

  const PHASES = [0, 1, 2, 3] as const;

  const flickeringWindowPaths = (windows: ReadonlyArray<Window>) => {
    const flickering = windows.filter((light) => light.isFlickering);

    return PHASES.map((phase) => ({
      phase,
      tone: phase % TONES.length,
      path: flickering
        .filter((_, index) => index % PHASES.length === phase)
        .map(windowPath)
        .join(""),
    })).filter((group) => group.path !== "");
  };

  const far = buildRow({
    layer: "far",
    seed: 11,
    minWidth: 26,
    maxWidth: 60,
    minHeight: 30,
    maxHeight: 92,
  });
  const mid = buildRow({
    layer: "mid",
    seed: 47,
    minWidth: 34,
    maxWidth: 74,
    minHeight: 22,
    maxHeight: 70,
  });
  const near = buildRow({
    layer: "near",
    seed: 89,
    minWidth: 40,
    maxWidth: 90,
    minHeight: 14,
    maxHeight: 50,
  });

  const FAR_PATH = far.map(roofShape).join("");
  const MID_PATH = mid.map(roofShape).join("");
  const NEAR_PATH = near.map(roofShape).join("");

  const MID_WINDOWS = windowsFor(mid, 3);
  const NEAR_WINDOWS = windowsFor(near, 7);

  const MID_STATIC_WINDOWS = staticWindowPaths(MID_WINDOWS);
  const MID_FLICKERING_WINDOWS = flickeringWindowPaths(MID_WINDOWS);
  const NEAR_STATIC_WINDOWS = staticWindowPaths(NEAR_WINDOWS);
  const NEAR_FLICKERING_WINDOWS = flickeringWindowPaths(NEAR_WINDOWS);

  const ANTENNAS = [...far, ...mid]
    .filter((building) => building.roof === "antenna")
    .map((building) => ({
      key: building.key,
      x: building.x + building.width / 2,
      top: GROUND - building.height,
    }));

  const SHIMMER = PHASES.map((phase) => ({
    phase,
    path: Array.from({ length: 36 }, (_, index) => index)
      .filter((index) => index % PHASES.length === phase)
      .map((index) => {
        const width = between(index * 13, 8, 36).toFixed(1);
        return `M${between(index * 5, 0, WIDTH).toFixed(1)} ${between(index * 9, 124, 138).toFixed(1)}h${width}v0.8h-${width}z`;
      })
      .join(""),
  }));
</script>

<script lang="ts">
  import SplashScene from "../splash/SplashScene.svelte";

  const uid = $props.id();
</script>

<SplashScene height="clamp(var(--ni-200), 26vw, var(--ni-260))">
  <div class="trakt-new-year-skyline">
    <svg
      class="skyline-scene"
      viewBox="0 -40 {WIDTH} 180"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id="{uid}-horizon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" class="horizon-top" />
          <stop offset="1" class="horizon-bottom" />
        </linearGradient>
        <linearGradient id="{uid}-beam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" class="beam-start" />
          <stop offset="0.8" class="beam-end" />
        </linearGradient>
        <linearGradient id="{uid}-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" class="water-top" />
          <stop offset="1" class="water-bottom" />
        </linearGradient>
        <linearGradient id="{uid}-reflection-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="white" stop-opacity="0.6" />
          <stop offset="1" stop-color="white" stop-opacity="0" />
        </linearGradient>
        <mask id="{uid}-reflection-mask">
          <rect
            x="0"
            y={GROUND}
            width={WIDTH}
            height="20"
            fill="url(#{uid}-reflection-fade)"
          />
        </mask>
      </defs>

      <rect
        class="skyline-horizon"
        x="0"
        y="20"
        width={WIDTH}
        height="100"
        fill="url(#{uid}-horizon)"
      />

      <path
        class="skyline-beam"
        style="--beam-x: 620px; --beam-delay: 0s"
        fill="url(#{uid}-beam)"
        d="M616 60L560-40h40L624 60z"
      />
      <path
        class="skyline-beam"
        style="--beam-x: 1010px; --beam-delay: -4s"
        fill="url(#{uid}-beam)"
        d="M1006 60L1000-40h40L1014 60z"
      />

      <path class="skyline-layer" data-layer="far" d={FAR_PATH} />

      {#each ANTENNAS as antenna (antenna.key)}
        <path class="skyline-antenna" d="M{antenna.x} {antenna.top}v-14" />
      {/each}

      <g class="antenna-light">
        {#each ANTENNAS as antenna (antenna.key)}
          <circle
            class="light-halo"
            cx={antenna.x}
            cy={antenna.top - 14}
            r="3.4"
          />
          <circle cx={antenna.x} cy={antenna.top - 14} r="1.4" />
        {/each}
      </g>

      <path class="skyline-layer" data-layer="mid" d={MID_PATH} />

      {#each MID_STATIC_WINDOWS as windows (windows.tone)}
        <path
          class="skyline-window"
          data-layer="mid"
          data-tone={windows.tone}
          d={windows.path}
        />
      {/each}

      {#each MID_FLICKERING_WINDOWS as group (group.phase)}
        <path
          class="skyline-window is-flickering"
          data-layer="mid"
          data-tone={group.tone}
          d={group.path}
          style="--window-delay: {group.phase * -1.25}s"
        />
      {/each}

      <g id="{uid}-near">
        <path class="skyline-layer" data-layer="near" d={NEAR_PATH} />

        <path
          class="skyline-layer"
          data-layer="near"
          d="M684 120V40h32v80zM678 40V18h44v22zM674 18L700-12 726 18zM699-12h2v-14h-2z"
        />
        <path
          class="tower-windows"
          d="M692 52h4v9h-4zM704 52h4v9h-4zM692 72h4v9h-4zM704 72h4v9h-4zM692 92h4v9h-4zM704 92h4v9h-4z"
        />

        <path
          class="skyline-layer"
          data-layer="near"
          d="M912 120V30h40v90zM918 30V16h28v14zM924 16V4h16V16zM929 4L932-26 935 4z"
        />
        <path class="deco-crown" d="M918 30l14-12 14 12M924 16l8-8 8 8" />

        {#each NEAR_STATIC_WINDOWS as windows (windows.tone)}
          <path class="skyline-window" data-tone={windows.tone} d={windows.path} />
        {/each}
      </g>

      <g class="skyline-clock">
        <circle class="tower-clock" cx="700" cy="29" r="8.4" />
        <path class="tower-ticks" d="M700 21.6v2M700 34.4v2M692.6 29h2M705.4 29h2" />
        <path class="tower-hand is-hour" d="M700 29v-5" />
        <path class="tower-hand is-minute" d="M700 29v-7" />
        <circle class="tower-pin" cx="700" cy="29" r="0.9" />
      </g>

      <path class="deco-lights" d="M920 40v74M928 40v74M936 40v74M944 40v74" />

      {#each NEAR_FLICKERING_WINDOWS as group (group.phase)}
        <path
          class="skyline-window is-flickering"
          data-tone={group.tone}
          d={group.path}
          style="--window-delay: {group.phase * -1.25}s"
        />
      {/each}

      <rect
        class="skyline-water"
        x="0"
        y={GROUND}
        width={WIDTH}
        height="20"
        fill="url(#{uid}-water)"
      />

      <g mask="url(#{uid}-reflection-mask)">
        <use href="#{uid}-near" transform="translate(0 {GROUND * 2}) scale(1 -1)" />
      </g>

      {#each SHIMMER as group (group.phase)}
        <path
          class="water-shimmer"
          d={group.path}
          style="--shimmer-delay: {group.phase * -1}s"
        />
      {/each}
    </svg>
  </div>
</SplashScene>

<style>
  .trakt-new-year-skyline {
    position: absolute;
    inset: 0;
    overflow: hidden;

    .skyline-scene {
      position: absolute;
      bottom: 0;
      left: 50%;

      height: 100%;
      aspect-ratio: 1600 / 180;

      transform: translateX(-50%);
    }

    .horizon-top {
      stop-color: var(--purple-500);
      stop-opacity: 0;
    }

    .horizon-bottom {
      stop-color: var(--purple-400);
      stop-opacity: 0.35;
    }

    .beam-start {
      stop-color: var(--yellow-50);
      stop-opacity: 0.35;
    }

    .beam-end {
      stop-color: var(--yellow-50);
      stop-opacity: 0;
    }

    .skyline-beam {
      transform-box: view-box;
      transform-origin: var(--beam-x) 60px;
      animation: beam-sweep 8s ease-in-out var(--beam-delay) infinite
        alternate;
    }

    .skyline-layer {
      &[data-layer="far"] {
        fill: color-mix(in oklch, var(--blue-900) 60%, var(--shade-800));
        opacity: 0.8;
      }

      &[data-layer="mid"] {
        fill: color-mix(in oklch, var(--blue-900) 35%, var(--shade-940));
      }

      &[data-layer="near"] {
        fill: var(--shade-1000);
        stroke: color-mix(in srgb, var(--purple-300) 30%, transparent);
        stroke-width: 0.5;
      }
    }

    .skyline-antenna {
      stroke: color-mix(in oklch, var(--blue-900) 60%, var(--shade-800));
      stroke-width: 1.2;
    }

    .antenna-light {
      fill: var(--red-400);
      animation: antenna-blink 1.6s steps(1) infinite;

      .light-halo {
        opacity: 0.3;
      }
    }

    .skyline-window {
      fill: var(--yellow-200);
      opacity: 0.9;

      &[data-tone="1"] {
        fill: var(--yellow-100);
      }

      &[data-tone="2"] {
        fill: var(--orange-200);
      }

      &[data-layer="mid"] {
        opacity: 0.45;
      }

      &.is-flickering {
        animation: window-flicker 5s steps(1) var(--window-delay) infinite;
      }
    }

    .tower-clock {
      fill: var(--yellow-50);
      stroke: var(--purple-300);
      stroke-width: 1.2;
      filter: drop-shadow(0 0 var(--ni-8) var(--yellow-200));
    }

    .tower-ticks,
    .tower-hand {
      fill: none;
      stroke: var(--shade-900);
      stroke-width: 1;
      stroke-linecap: round;
    }

    .tower-hand {
      transform-box: view-box;
      transform-origin: 700px 29px;

      &.is-hour {
        stroke-width: 1.5;
        animation: hour-hand 4s steps(2, jump-none) 1s both;
      }

      &.is-minute {
        animation: minute-hand 4s steps(5, jump-none) 1s both;
      }
    }

    .tower-pin {
      fill: var(--shade-900);
    }

    .tower-windows {
      fill: var(--yellow-200);
      opacity: 0.8;
    }

    .deco-crown {
      fill: none;
      stroke: var(--purple-200);
      stroke-width: 1.2;
      filter: drop-shadow(0 0 var(--ni-3) var(--purple-300));
    }

    .deco-lights {
      fill: none;
      stroke: var(--purple-200);
      stroke-width: 0.8;
      stroke-dasharray: 1.4 3;
      opacity: 0.7;
      animation: deco-chase 2s linear infinite;
    }

    .water-top {
      stop-color: color-mix(in oklch, var(--blue-900) 60%, var(--shade-940));
    }

    .water-bottom {
      stop-color: var(--shade-1000);
    }

    .water-shimmer {
      fill: var(--purple-200);
      opacity: 0;
      animation: water-shimmer 4s ease-in-out var(--shimmer-delay) infinite;
    }
  }

  @keyframes beam-sweep {
    from {
      transform: rotate(-22deg);
    }
    to {
      transform: rotate(18deg);
    }
  }

  @keyframes antenna-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.15;
    }
  }

  @keyframes window-flicker {
    0%,
    100% {
      opacity: 0.9;
    }
    70% {
      opacity: 0.1;
    }
  }

  @keyframes hour-hand {
    from {
      transform: rotate(-4deg);
    }
    to {
      transform: rotate(0);
    }
  }

  @keyframes minute-hand {
    from {
      transform: rotate(-24deg);
    }
    to {
      transform: rotate(0);
    }
  }

  @keyframes deco-chase {
    to {
      stroke-dashoffset: -8.8;
    }
  }

  @keyframes water-shimmer {
    0%,
    100% {
      opacity: 0;
      transform: translateX(0);
    }
    50% {
      opacity: 0.7;
      transform: translateX(var(--ni-6));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-new-year-skyline .skyline-beam,
    .trakt-new-year-skyline .antenna-light,
    .trakt-new-year-skyline .skyline-window.is-flickering,
    .trakt-new-year-skyline .deco-lights,
    .trakt-new-year-skyline .water-shimmer {
      animation: none;
    }

    .trakt-new-year-skyline .tower-hand {
      animation-duration: 0s;
      animation-delay: 0s;
    }
  }
</style>
