<script lang="ts">
  import BatSilhouette from "./BatSilhouette.svelte";

  const bats = [
    { key: "north", dx: -10, dy: -150, delay: 1.4, scale: 0.9 },
    { key: "east", dx: 190, dy: -60, delay: 1.8, scale: 1.1 },
    { key: "west", dx: -200, dy: -40, delay: 2.3, scale: 1 },
    { key: "north-east", dx: 120, dy: -170, delay: 3.1, scale: 0.7 },
    { key: "north-west", dx: -140, dy: -130, delay: 3.6, scale: 0.8 },
    { key: "far-east", dx: 230, dy: 30, delay: 4.4, scale: 0.6 },
  ];
</script>

<div class="trakt-halloween-moon">
  <div class="moon-disc"></div>

  {#each bats as bat (bat.key)}
    <div
      class="moon-bat"
      style="--bat-dx: {bat.dx}%; --bat-dy: {bat.dy}%; --bat-delay: {bat.delay}s; --bat-scale: {bat.scale}"
    >
      <BatSilhouette />
    </div>
  {/each}
</div>

<style>
  .trakt-halloween-moon {
    --moon-size: calc(var(--hero-size) * 2);

    position: relative;

    width: var(--moon-size);
    height: var(--moon-size);

    .moon-disc {
      position: absolute;
      inset: 0;

      border-radius: 50%;
      background:
        radial-gradient(
          circle at 28% 34%,
          color-mix(in srgb, var(--orange-300) 45%, transparent) 0 6%,
          transparent 7%
        ),
        radial-gradient(
          circle at 70% 62%,
          color-mix(in srgb, var(--orange-300) 40%, transparent) 0 9%,
          transparent 10%
        ),
        radial-gradient(
          circle at 62% 24%,
          color-mix(in srgb, var(--orange-300) 35%, transparent) 0 4%,
          transparent 5%
        ),
        radial-gradient(
          circle at 38% 36%,
          var(--yellow-50),
          var(--yellow-200) 45%,
          var(--orange-300) 100%
        );

      animation: moon-rise 1100ms cubic-bezier(0.22, 1, 0.36, 1) both;

      &::after {
        content: "";

        position: absolute;
        inset: 0;

        border-radius: 50%;
        box-shadow:
          0 0 var(--ni-64)
            color-mix(in srgb, var(--orange-300) 60%, transparent),
          0 0 var(--ni-200)
            color-mix(in srgb, var(--orange-500) 40%, transparent);

        opacity: 0.8;
        animation: moon-glow 6s ease-in-out 1100ms infinite;
      }
    }

    .moon-bat {
      --bat-color: var(--shade-1000);

      position: absolute;
      top: 45%;
      left: 45%;

      width: 12%;
      height: 6%;

      opacity: 0;
      animation: bat-escape 5.5s ease-in var(--bat-delay) infinite;
    }
  }

  @keyframes moon-rise {
    from {
      opacity: 0;
      transform: translateY(20%) scale(0.85);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes moon-glow {
    0%,
    100% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes bat-escape {
    0% {
      opacity: 0;
      transform: translate(0, 0) scale(calc(var(--bat-scale) * 0.3));
    }
    10% {
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(calc(var(--bat-dx) * 3), calc(var(--bat-dy) * 3))
        scale(calc(var(--bat-scale) * 2.2));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-halloween-moon .moon-disc,
    .trakt-halloween-moon .moon-disc::after {
      animation: none;
    }

    .trakt-halloween-moon .moon-bat {
      display: none;
    }
  }
</style>
