<script lang="ts" module>
  const arms = [0, 60, 120, 180, 240, 300];

  const stars = [
    { key: "a", x: -8, y: 6, size: 1, delay: 0.2 },
    { key: "b", x: 94, y: -4, size: 0.7, delay: 1.1 },
    { key: "c", x: 104, y: 70, size: 0.9, delay: 0.6 },
    { key: "d", x: -14, y: 78, size: 0.6, delay: 1.7 },
    { key: "e", x: 22, y: -16, size: 0.5, delay: 2.3 },
    { key: "f", x: 80, y: 104, size: 0.5, delay: 2.9 },
  ];
</script>

<div class="trakt-christmas-snowflake">
  <svg class="snowflake" viewBox="-50 -50 100 100">
    {#each arms as arm (arm)}
      <g transform="rotate({arm})">
        <path d="M0 0V-46" />
        <path d="M0-14l-7-7M0-14l7-7" />
        <path d="M0-26l-9-9M0-26l9-9" />
        <path d="M0-37l-5-5M0-37l5-5" />
        <circle cx="0" cy="-46" r="1.6" />
      </g>
    {/each}
    <circle cx="0" cy="0" r="5" />
  </svg>

  {#each stars as star (star.key)}
    <svg
      class="twinkle"
      viewBox="-10 -10 20 20"
      style="--star-x: {star.x}%; --star-y: {star.y}%; --star-size: {star.size}; --star-delay: {star.delay}s"
    >
      <path d="M0-10Q1-1 10 0Q1 1 0 10Q-1 1-10 0Q-1-1 0-10z" />
    </svg>
  {/each}
</div>

<style>
  .trakt-christmas-snowflake {
    --flake-size: calc(var(--centerpiece-size) * 2.4);

    position: relative;

    width: var(--flake-size);
    height: var(--flake-size);

    .snowflake {
      width: 100%;
      height: 100%;

      fill: var(--shade-10);
      stroke: var(--shade-10);
      stroke-width: 1.4;
      stroke-linecap: round;
      opacity: 0.16;

      animation:
        flake-in 1200ms ease-out both,
        flake-spin 80s linear infinite;
    }

    .twinkle {
      position: absolute;
      top: var(--star-y);
      left: var(--star-x);

      width: calc(var(--ni-24) * var(--star-size));
      height: calc(var(--ni-24) * var(--star-size));

      fill: var(--yellow-100);
      filter: drop-shadow(0 0 var(--ni-6) var(--yellow-300));

      animation: star-twinkle 2.8s ease-in-out var(--star-delay) infinite;
    }
  }

  @keyframes flake-in {
    from {
      opacity: 0;
      scale: 0.5;
      rotate: -40deg;
    }
  }

  @keyframes flake-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes star-twinkle {
    0%,
    100% {
      opacity: 0.2;
      transform: scale(0.5) rotate(0);
    }
    50% {
      opacity: 1;
      transform: scale(1) rotate(45deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-christmas-snowflake .snowflake,
    .trakt-christmas-snowflake .twinkle {
      animation: none;
    }
  }
</style>
