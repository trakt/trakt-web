<script lang="ts">
  const sparkles = [
    { key: "left", x: 4, y: 12, delay: 0 },
    { key: "right", x: 32, y: 8, delay: 0.6 },
    { key: "top", x: 26, y: 2, delay: 1.2 },
  ];
</script>

<svg class="trakt-party-hat-mascot" viewBox="0 0 36 44" aria-hidden="true">
  <path class="hat-cone" d="M18 6L32 40H4z" />
  <circle class="hat-dot" cx="17" cy="16" r="1.8" />
  <circle class="hat-dot" cx="21.5" cy="23" r="1.8" />
  <circle class="hat-dot" cx="13" cy="27" r="1.8" />
  <circle class="hat-dot" cx="24" cy="33" r="1.8" />
  <circle class="hat-dot" cx="10" cy="35" r="1.4" />
  <path
    class="hat-trim"
    d="M3 39l2.5-2.5L8 39l2.5-2.5L13 39l2.5-2.5L18 39l2.5-2.5L23 39l2.5-2.5L28 39l2.5-2.5L33 39v3H3z"
  />
  <circle class="hat-pompom" cx="18" cy="6" r="3.5" />

  {#each sparkles as sparkle (sparkle.key)}
    <path
      class="hat-sparkle"
      style="--sparkle-delay: {sparkle.delay}s"
      transform="translate({sparkle.x} {sparkle.y})"
      d="M0-3.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z"
    />
  {/each}
</svg>

<style>
  .trakt-party-hat-mascot {
    width: 100%;
    height: 100%;
    overflow: visible;

    filter: drop-shadow(0 var(--ni-2) var(--ni-4) var(--color-shadow));

    .hat-cone {
      fill: var(--purple-300);
    }

    .hat-dot,
    .hat-trim {
      fill: var(--purple-600);
    }

    .hat-pompom {
      fill: var(--shade-10);
    }

    .hat-sparkle {
      fill: var(--purple-200);
      transform-box: fill-box;
      transform-origin: center;
      animation: sparkle-twinkle 1.8s ease-in-out infinite;
      animation-delay: var(--sparkle-delay);
    }
  }

  @keyframes sparkle-twinkle {
    0%,
    100% {
      scale: 0.2;
      opacity: 0;
    }
    50% {
      scale: 1;
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-party-hat-mascot .hat-sparkle {
      animation: none;
    }
  }
</style>
