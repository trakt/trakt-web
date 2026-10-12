<script lang="ts">
  import SplashScene from "../splash/SplashScene.svelte";

  const uid = $props.id();

  const pickets = [
    { x: 82, height: 22, tilt: -6 },
    { x: 89, height: 26, tilt: 3 },
    { x: 96, height: 20, tilt: -2 },
    { x: 103, height: 25, tilt: 8 },
    { x: 110, height: 21, tilt: -4 },
    { x: 117, height: 24, tilt: 5 },
  ];

  const pumpkins = [
    { key: "fence", x: 128, y: 104, scale: 1, delay: 0, cluster: "start" },
    { key: "hill-big", x: 92, y: 104, scale: 1.3, delay: 0.6, cluster: "end" },
    { key: "hill-small", x: 114, y: 106, scale: 0.8, delay: 1.2, cluster: "end" },
  ];
</script>

{#snippet pumpkin(item: { x: number; y: number; scale: number; delay: number })}
  <g
    class="graveyard-pumpkin"
    style="--flicker-delay: {item.delay}s"
    transform="translate({item.x} {item.y}) scale({item.scale})"
  >
    <ellipse
      cx="0"
      cy="-1"
      rx="17"
      ry="13"
      fill="url(#{uid}-pumpkin-glow)"
    />
    <ellipse class="pumpkin-body" cx="-4" cy="0" rx="6" ry="6.6" />
    <ellipse class="pumpkin-body" cx="4" cy="0" rx="6" ry="6.6" />
    <ellipse class="pumpkin-body" cx="0" cy="0" rx="5.6" ry="7" />
    <path class="pumpkin-stem" d="M-1-6.4c0-2 1-3.6 3-4.4l.6 1c-1.4.8-1.8 2-1.6 3.4z" />
    <path
      class="pumpkin-face"
      d="M-5.2-2.6l2.6-1.8.6 3zM5.2-2.6L2.6-4.4 2-1.4zM-6 1.4q6 5.6 12 0l-1.6.4-.8 1.4-1.2-1-1.2 1.4-1.2-1.2-1.2 1.2-1.2-1.4-1.2 1-.8-1.4z"
    />
  </g>
{/snippet}

<SplashScene>
  <div class="trakt-halloween-graveyard">
    <svg class="graveyard-ground" viewBox="0 0 400 40" preserveAspectRatio="none">
      <path class="is-far" d="M0 14Q50 2 110 10T230 8T340 6T400 12V40H0z" />
      <path class="is-near" d="M0 26Q80 16 170 24T320 20T400 24V40H0z" />
    </svg>

    <svg class="graveyard-cluster" data-cluster="start" viewBox="0 0 200 120">
      <defs>
        <radialGradient id="{uid}-pumpkin-glow">
          <stop offset="0" class="glow-core" />
          <stop offset="1" class="glow-edge" />
        </radialGradient>
      </defs>

      <g class="graveyard-tree">
        <path class="is-trunk" d="M48 112C44 94 56 82 48 66S40 46 50 34" />
        <path
          class="is-branch"
          d="M48 66C36 62 28 54 26 44c-1-6 5-9 8-5 2 3-1 6-3 4"
        />
        <path
          class="is-branch"
          d="M49 54C60 50 70 42 70 32c0-6-7-7-8-2-1 3 3 5 5 2"
        />
        <path class="is-twig" d="M50 34c-2-8 4-14 11-13 4 1 4 6 0 6-2 0-2-2 0-2" />
        <path class="is-twig" d="M47 72C40 76 33 74 30 70c-2-3 1-6 3-4" />
        <path class="is-twig" d="M50 34c-4-4-10-3-11 1-1 3 3 4 4 2" />
      </g>

      <g class="graveyard-fence">
        <path class="fence-rail" d="M78 96q22-3 44 1M78 104q22-2 44 0" />
        {#each pickets as picket (picket.x)}
          <path
            class="fence-picket"
            transform="translate({picket.x} 110) rotate({picket.tilt})"
            d="M-2 0V-{picket.height}l2-4 2 4V0z"
          />
        {/each}
      </g>

      <path
        class="graveyard-stone"
        transform="translate(160 110) rotate(-9)"
        d="M-9 0V-22c0-9 4-15 9-15s10 5 9 16V0z"
      />
      <path
        class="graveyard-stone"
        transform="translate(184 110) rotate(11)"
        d="M-6 0V-14c0-4 2-8 6-9 4 1 6 5 6 10V0z"
      />

      {#each pumpkins.filter((item) => item.cluster === "start") as item (item.key)}
        {@render pumpkin(item)}
      {/each}
    </svg>

    <svg class="graveyard-cluster" data-cluster="end" viewBox="0 0 200 120">
      <path class="graveyard-hill-fill" d="M20 120C64 112 100 94 124 68c6 10 30 30 76 36v16z" />
      <path class="graveyard-hill" d="M30 116C70 108 104 88 124 66 136 54 150 46 160 50c10 4 10 18-2 18-8 0-8-10-1-9" />

      <g class="graveyard-ghost">
        <path class="ghost-body" d="M52 92c0-8 5-13 11-13s11 5 11 13v6H52z" />
        <ellipse class="ghost-eye" cx="59" cy="88" rx="1.4" ry="2" />
        <ellipse class="ghost-eye" cx="66" cy="88" rx="1.4" ry="2" />
      </g>

      <path
        class="graveyard-stone"
        transform="translate(62 112) rotate(6)"
        d="M-12 0V-18c0-6 3-10 7-11 2-3 8-3 10 0 4 1 7 5 7 11V0z"
      />
      <path
        class="graveyard-stone"
        transform="translate(34 112) rotate(-7)"
        d="M-5 0V-20l5-7 5 7V0z"
      />

      {#each pumpkins.filter((item) => item.cluster === "end") as item (item.key)}
        {@render pumpkin(item)}
      {/each}
    </svg>

    <div class="graveyard-fog"></div>
  </div>
</SplashScene>

<style>
  .trakt-halloween-graveyard {
    --graveyard-far: color-mix(
      in oklch,
      var(--color-halloween-hat) 88%,
      var(--shade-10)
    );
    --graveyard-near: color-mix(
      in oklch,
      var(--color-halloween-hat) 55%,
      var(--shade-1000)
    );

    --graveyard-height: var(--scene-height);

    position: absolute;
    inset: 0;

    .graveyard-ground {
      position: absolute;
      bottom: 0;
      inset-inline: 0;

      width: 100%;
      height: 34%;

      .is-far {
        fill: var(--graveyard-far);
      }

      .is-near {
        fill: var(--graveyard-near);
      }
    }

    .graveyard-cluster {
      position: absolute;
      bottom: 0;

      width: calc(var(--graveyard-height) * 5 / 3);
      height: 100%;

      &[data-cluster="start"] {
        inset-inline-start: 0;
      }

      &[data-cluster="end"] {
        inset-inline-end: 0;
      }
    }

    .graveyard-tree,
    .fence-rail,
    .graveyard-hill {
      fill: none;
      stroke: var(--graveyard-near);
      stroke-linecap: round;
    }

    .graveyard-tree {
      .is-trunk {
        stroke-width: 6;
      }

      .is-branch {
        stroke-width: 3;
      }

      .is-twig {
        stroke-width: 1.8;
      }
    }

    .fence-rail {
      stroke-width: 2;
    }

    .graveyard-hill {
      stroke-width: 9;
    }

    .graveyard-hill-fill,
    .fence-picket,
    .graveyard-stone {
      fill: var(--graveyard-near);
    }

    .graveyard-stone {
      stroke: var(--graveyard-far);
      stroke-width: 0.8;
    }

    .graveyard-ghost {
      animation: ghost-peek 4.5s ease-in-out infinite;

      .ghost-body {
        fill: var(--shade-10);
      }

      .ghost-eye {
        fill: var(--shade-920);
      }
    }

    .glow-core {
      stop-color: var(--orange-400);
      stop-opacity: 0.3;
    }

    .glow-edge {
      stop-color: var(--orange-400);
      stop-opacity: 0;
    }

    .pumpkin-body {
      fill: var(--orange-600);
      stroke: var(--orange-800);
      stroke-width: 0.6;
    }

    .pumpkin-stem {
      fill: var(--green-700);
    }

    .pumpkin-face {
      fill: var(--yellow-200);
      animation: pumpkin-flicker 1.8s ease-in-out var(--flicker-delay) infinite;
    }

    .graveyard-fog {
      position: absolute;
      bottom: 0;
      inset-inline: -20%;
      height: 40%;

      background:
        radial-gradient(
          ellipse at 30% 100%,
          color-mix(in srgb, var(--shade-200) 22%, transparent),
          transparent 60%
        ),
        radial-gradient(
          ellipse at 75% 100%,
          color-mix(in srgb, var(--color-halloween-hat) 40%, transparent),
          transparent 60%
        );
      filter: blur(var(--ni-12));

      animation: fog-drift 14s ease-in-out infinite alternate;
    }
  }

  @keyframes ghost-peek {
    0%,
    100% {
      transform: translateY(0);
    }
    40%,
    70% {
      transform: translateY(calc(-1 * var(--ni-12)));
    }
  }

  @keyframes pumpkin-flicker {
    0%,
    100% {
      opacity: 1;
    }
    40% {
      opacity: 0.55;
    }
    55% {
      opacity: 0.9;
    }
    70% {
      opacity: 0.65;
    }
  }

  @keyframes fog-drift {
    from {
      transform: translateX(-6%);
    }
    to {
      transform: translateX(6%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-halloween-graveyard .graveyard-ghost,
    .trakt-halloween-graveyard .pumpkin-face,
    .trakt-halloween-graveyard .graveyard-fog {
      animation: none;
    }
  }
</style>
