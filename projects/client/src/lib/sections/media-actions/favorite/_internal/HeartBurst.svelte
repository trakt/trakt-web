<script lang="ts" module>
  const DOT_COUNT = 8;
  const DOT_COLORS = [
    "var(--color-background-red)",
    "var(--purple-500)",
    "var(--orange-400)",
  ];

  function dots() {
    return Array.from({ length: DOT_COUNT }, (_, index) => {
      const angle = (index / DOT_COUNT) * Math.PI * 2 - Math.PI / 2;
      return {
        x: Math.cos(angle),
        y: Math.sin(angle),
        color: DOT_COLORS[index % DOT_COLORS.length],
      };
    });
  }
</script>

<script lang="ts">
  const burst = dots();
</script>

<div class="trakt-heart-burst" aria-hidden="true">
  <span class="heart-ring"></span>
  {#each burst as dot, index (index)}
    <span
      class="heart-dot"
      style="--dot-x: {dot.x}; --dot-y: {dot.y}; --dot-color: {dot.color};"
    ></span>
  {/each}
</div>

<style>
  .trakt-heart-burst {
    --burst-radius: var(--ni-24);
    --burst-duration: 460ms;

    position: absolute;
    inset: 0;
    pointer-events: none;

    > * {
      position: absolute;
      top: 50%;
      left: 50%;
    }
  }

  .heart-ring {
    width: var(--ni-36);
    height: var(--ni-36);
    margin: calc(var(--ni-36) / -2);
    border-radius: 50%;
    border: var(--ni-2) solid var(--color-background-red);
    animation: heart-ring var(--burst-duration) ease-out both;
  }

  .heart-dot {
    width: var(--ni-6);
    height: var(--ni-6);
    margin: calc(var(--ni-6) / -2);
    border-radius: 50%;
    background-color: var(--dot-color);
    animation: heart-dot var(--burst-duration) cubic-bezier(0.2, 0.8, 0.3, 1)
      both;
  }

  @keyframes heart-ring {
    from {
      opacity: 1;
      transform: scale(0.4);
    }
    to {
      opacity: 0;
      transform: scale(1.5);
    }
  }

  @keyframes heart-dot {
    0% {
      opacity: 0;
      transform: translate(0, 0) scale(0.4);
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(
          calc(var(--dot-x) * var(--burst-radius)),
          calc(var(--dot-y) * var(--burst-radius))
        )
        scale(0.6);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-heart-burst {
      display: none;
    }
  }
</style>
