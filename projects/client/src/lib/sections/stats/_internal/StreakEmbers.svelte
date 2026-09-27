<script lang="ts" module>
  import { random } from "$lib/utils/number/random.ts";

  const EMBER_COUNT = 12;

  function embers() {
    return Array.from({ length: EMBER_COUNT }, (_, index) => ({
      startX: random(-10, 10),
      driftX: random(-18, 18),
      rise: random(30, 64),
      size: random(3, 5),
      delay: index * 45,
      duration: random(700, 1100),
      isHot: index % 3 === 0,
    }));
  }

  function emberStyle(ember: ReturnType<typeof embers>[number]) {
    return [
      `--start-x: ${ember.startX}px`,
      `--drift-x: ${ember.driftX}px`,
      `--rise: ${ember.rise}px`,
      `--size: ${ember.size}px`,
      `--delay: ${ember.delay}ms`,
      `--duration: ${ember.duration}ms`,
    ].join("; ");
  }
</script>

<script lang="ts">
  const batch = embers();
</script>

<div class="trakt-streak-embers" aria-hidden="true">
  {#each batch as ember, index (index)}
    <span
      class="streak-ember"
      class:is-hot={ember.isHot}
      style={emberStyle(ember)}
    ></span>
  {/each}
</div>

<style>
  .trakt-streak-embers {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .streak-ember {
    position: absolute;
    top: 40%;
    left: 50%;
    width: var(--size);
    height: var(--size);
    margin: calc(var(--size) / -2);
    border-radius: 50%;
    background-color: var(--orange-400);
    animation: streak-ember var(--duration) var(--delay) ease-out both;

    &.is-hot {
      background-color: var(--yellow-400);
    }
  }

  @keyframes streak-ember {
    0% {
      opacity: 0;
      transform: translate(calc(var(--rtl-sign) * var(--start-x)), 0);
    }
    10% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(
        calc(var(--rtl-sign) * (var(--start-x) + var(--drift-x))),
        calc(var(--rise) * -1)
      );
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-streak-embers {
      display: none;
    }
  }
</style>
