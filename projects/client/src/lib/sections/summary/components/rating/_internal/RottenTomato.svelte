<script lang="ts" module>
  import { random } from "$lib/utils/number/random.ts";

  const SPLAT_POINTS = 16;
  const DROP_COUNT = 8;

  function splatPath() {
    const points = Array.from({ length: SPLAT_POINTS }, (_, index) => {
      const angle = (index / SPLAT_POINTS) * Math.PI * 2;
      const radius = index % 2 ? random(9, 13) : random(15, 21);
      return [24 + Math.cos(angle) * radius, 24 + Math.sin(angle) * radius];
    });

    const midpoint = (from: number[], to: number[]) =>
      [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2].map((value) =>
        value.toFixed(1)
      ).join(" ");

    const start = midpoint(points.at(-1) ?? [24, 24], points[0]);
    const curves = points.map((point, index) => {
      const next = points[(index + 1) % SPLAT_POINTS];
      return `Q${point[0].toFixed(1)} ${point[1].toFixed(1)} ${
        midpoint(point, next)
      }`;
    });

    return `M${start} ${curves.join(" ")}Z`;
  }

  function drops() {
    return Array.from({ length: DROP_COUNT }, () => {
      const angle = random(0, Math.PI * 2);
      const distance = random(18, 32);
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance + 12,
      };
    });
  }
</script>

<script lang="ts">
  import type { RatingDelight } from "../models/RatingDelight.ts";

  const { origin }: Pick<RatingDelight, "origin"> = $props();

  const splat = splatPath();
  const splatter = drops();
</script>

<div
  class="trakt-rotten-tomato"
  style="--origin-x: {origin.x}px; --origin-y: {origin.y}px;"
  aria-hidden="true"
>
  <div class="tomato-flight">
    <div class="tomato-arc">
      <svg class="tomato" viewBox="0 0 24 24" width="24" height="24">
        <circle class="tomato-body" cx="12" cy="13.5" r="9.5" />
        <path
          class="tomato-leaf"
          d="M12 3.5l1.6 2.6 3-.6-1.9 2.4 2.6 1.3-3.4.2L12 12l-1.9-2.6-3.4-.2 2.6-1.3-1.9-2.4 3 .6z"
        />
        <ellipse class="tomato-shine" cx="8" cy="11" rx="2.4" ry="1.4" />
      </svg>
    </div>
  </div>

  <svg class="tomato-splat" viewBox="0 0 48 48" width="48" height="48">
    <path d={splat} />
  </svg>

  {#each splatter as drop, index (index)}
    <span
      class="tomato-drop"
      style="--drop-x: {drop.x}px; --drop-y: {drop.y}px;"
    ></span>
  {/each}
</div>

<style>
  .trakt-rotten-tomato {
    --flight-duration: 460ms;

    position: absolute;
    left: var(--origin-x);
    top: var(--origin-y);
    z-index: var(--layer-top);
    pointer-events: none;

    > * {
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .tomato-flight {
    animation:
      tomato-flight var(--flight-duration) linear forwards,
      tomato-impact 1ms var(--flight-duration) forwards;
  }

  .tomato-arc {
    animation: tomato-arc var(--flight-duration) forwards;
  }

  .tomato {
    display: block;
    margin: calc(var(--ni-12) * -1);
    animation: tomato-spin var(--flight-duration) linear forwards;
  }

  .tomato-body,
  .tomato-splat {
    fill: var(--red-500);
  }

  .tomato-leaf {
    fill: var(--green-500);
  }

  .tomato-shine {
    fill: var(--shade-10);
    opacity: 0.35;
  }

  .tomato-splat {
    display: block;
    margin: calc(var(--ni-24) * -1);
    animation: tomato-splat 1500ms ease-out var(--flight-duration) both;
  }

  .tomato-drop {
    width: var(--ni-6);
    height: var(--ni-6);
    margin: calc(var(--ni-3) * -1);
    border-radius: 50%;
    background-color: var(--red-500);
    animation: tomato-drop 520ms cubic-bezier(0.2, 0.7, 0.4, 1)
      var(--flight-duration) both;
  }

  @keyframes tomato-flight {
    from {
      transform: translateX(calc(var(--rtl-sign) * -110px));
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes tomato-arc {
    0% {
      transform: translateY(-64px);
      animation-timing-function: ease-out;
    }
    35% {
      transform: translateY(-86px);
      animation-timing-function: ease-in;
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes tomato-spin {
    to {
      transform: rotate(calc(var(--rtl-sign) * 420deg));
    }
  }

  @keyframes tomato-impact {
    to {
      opacity: 0;
    }
  }

  @keyframes tomato-splat {
    0% {
      opacity: 0;
      transform: scale(0.2);
    }
    1% {
      opacity: 1;
    }
    12% {
      transform: scale(1.12);
    }
    20%,
    60% {
      opacity: 0.95;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(10px) scaleY(1.15);
    }
  }

  @keyframes tomato-drop {
    0% {
      opacity: 0;
    }
    1% {
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(var(--drop-x), var(--drop-y)) scale(0.5);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-rotten-tomato {
      display: none;
    }
  }
</style>
