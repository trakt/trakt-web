<script lang="ts">
  import cloudsUrl from "./assets/halloween-clouds.webp";
  import moonUrl from "./assets/halloween-moon.webp";
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

<div
  class="trakt-halloween-moon"
  style="--moon-image: url({moonUrl}); --clouds-image: url({cloudsUrl})"
>
  <div class="moon-disc"></div>
  <div class="moon-clouds"></div>

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
      background: var(--moon-image) center / 103.5% no-repeat;

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

    .moon-clouds {
      position: absolute;
      top: 50%;
      left: 50%;

      width: 165%;
      aspect-ratio: 800 / 446;
      margin-top: calc(var(--moon-size) * -0.62);
      margin-left: -82.5%;

      background: var(--clouds-image) center / 100% 100% no-repeat;
      mask-image: radial-gradient(
        ellipse 50% 50% at 50% 50%,
        black 55%,
        transparent 100%
      );

      animation:
        clouds-in 1600ms ease-out 400ms both,
        clouds-drift 28s ease-in-out 2s infinite alternate both;
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

  @keyframes clouds-in {
    from {
      opacity: 0;
    }
  }

  @keyframes clouds-drift {
    from {
      transform: translateX(-4%);
    }
    to {
      transform: translateX(4%);
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
    .trakt-halloween-moon .moon-disc::after,
    .trakt-halloween-moon .moon-clouds {
      animation: none;
    }

    .trakt-halloween-moon .moon-bat {
      display: none;
    }
  }
</style>
