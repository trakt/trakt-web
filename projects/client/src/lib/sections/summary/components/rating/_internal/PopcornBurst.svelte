<script lang="ts" module>
  import { random } from "$lib/utils/number/random.ts";

  const KERNEL_COUNT = 16;
  const ROW_SPAN = 150;

  function kernels() {
    return Array.from({ length: KERNEL_COUNT }, () => ({
      startX: random(-ROW_SPAN, 0),
      drift: random(-26, 26),
      rise: random(40, 88),
      fall: random(30, 60),
      spin: random(-200, 200),
      delay: random(0, 520),
      duration: random(1100, 1500),
    }));
  }

  function kernelStyle(kernel: ReturnType<typeof kernels>[number]) {
    return [
      `--start-x: ${kernel.startX}px`,
      `--drift: ${kernel.drift}px`,
      `--rise: ${kernel.rise}px`,
      `--fall: ${kernel.fall}px`,
      `--spin: ${kernel.spin}deg`,
      `--delay: ${kernel.delay}ms`,
      `--duration: ${kernel.duration}ms`,
    ].join("; ");
  }
</script>

<script lang="ts">
  import type { RatingDelight } from "../models/RatingDelight.ts";

  const { origin }: Pick<RatingDelight, "origin"> = $props();

  const batch = kernels();
</script>

<div
  class="trakt-popcorn-burst"
  style="--origin-x: {origin.x}px; --origin-y: {origin.y}px;"
  aria-hidden="true"
>
  {#each batch as kernel, index (index)}
    <svg
      class="popcorn-kernel"
      viewBox="0 0 20 20"
      width="18"
      height="18"
      style={kernelStyle(kernel)}
    >
      <g class="kernel-puffs">
        <circle cx="6.5" cy="11.5" r="4.8" />
        <circle cx="13.5" cy="11.5" r="4.8" />
        <circle cx="10" cy="6.5" r="4.8" />
      </g>
      <circle class="kernel-hull" cx="10" cy="14" r="2.2" />
    </svg>
  {/each}
</div>

<style>
  .trakt-popcorn-burst {
    position: absolute;
    left: var(--origin-x);
    top: var(--origin-y);
    z-index: var(--layer-top);
    pointer-events: none;
  }

  .popcorn-kernel {
    position: absolute;
    top: 0;
    left: 0;
    margin: calc(var(--ni-18) / -2);
    animation: popcorn-pop var(--duration) var(--delay) both;
  }

  .kernel-puffs {
    fill: var(--yellow-50);
    stroke: var(--yellow-400);
    stroke-width: 1;
  }

  .kernel-hull {
    fill: var(--yellow-400);
  }

  @keyframes popcorn-pop {
    0% {
      opacity: 0;
      transform: translateX(calc(var(--rtl-sign) * var(--start-x))) scale(0.2);
      animation-timing-function: cubic-bezier(0.2, 0.7, 0.4, 1);
    }
    2% {
      opacity: 1;
    }
    42% {
      transform: translate(
          calc(var(--rtl-sign) * (var(--start-x) + var(--drift))),
          calc(var(--rise) * -1)
        )
        scale(1) rotate(calc(var(--spin) / 2));
      animation-timing-function: cubic-bezier(0.5, 0, 0.8, 0.5);
    }
    100% {
      opacity: 0;
      transform: translate(
          calc(var(--rtl-sign) * (var(--start-x) + var(--drift) * 1.5)),
          var(--fall)
        )
        scale(0.9) rotate(var(--spin));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-popcorn-burst {
      display: none;
    }
  }
</style>
