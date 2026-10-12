<script lang="ts">
  import LogoMarkCircle from "$lib/components/logo/LogoMarkCircle.svelte";

  const uid = $props.id();

  const cord = "M100 -150C92 -118 108 -86 100 -54S94 -8 100 30";

  const glints = [
    { key: "west", x: 8, y: 52, delay: 0.4 },
    { key: "east", x: 92, y: 40, delay: 1.6 },
    { key: "south", x: 76, y: 94, delay: 2.6 },
  ];
</script>

<div class="trakt-christmas-bauble">
  <svg class="bauble-art" viewBox="0 0 200 240" aria-hidden="true">
    <defs>
      <radialGradient id="{uid}-glass" cx="0.36" cy="0.3" r="0.78">
        <stop offset="0" class="glass-shine" />
        <stop offset="0.35" class="glass-light" />
        <stop offset="0.75" class="glass-mid" />
        <stop offset="1" class="glass-dark" />
      </radialGradient>
      <linearGradient id="{uid}-gold" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" class="gold-dark" />
        <stop offset="0.35" class="gold-light" />
        <stop offset="0.6" class="gold-mid" />
        <stop offset="1" class="gold-dark" />
      </linearGradient>
      <linearGradient
        id="{uid}-cord-fade-gradient"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1="-150"
        x2="0"
        y2="-60"
      >
        <stop offset="0" stop-color="black" />
        <stop offset="1" stop-color="white" />
      </linearGradient>
      <mask
        id="{uid}-cord-fade"
        maskUnits="userSpaceOnUse"
        x="80"
        y="-150"
        width="40"
        height="190"
      >
        <rect
          x="80"
          y="-150"
          width="40"
          height="190"
          fill="url(#{uid}-cord-fade-gradient)"
        />
      </mask>
      <clipPath id="{uid}-sphere">
        <circle cx="100" cy="144" r="84" />
      </clipPath>
    </defs>

    <g mask="url(#{uid}-cord-fade)">
      <path class="bauble-cord" d={cord} />
      <path class="bauble-cord-twist" d={cord} />
      <path class="bauble-cord-shine" d={cord} />
    </g>
    <path class="bauble-loop" d="M92 40c0-12 16-12 16 0" />

    <g class="bauble-bow">
      <path
        class="bow-tail"
        d="M99 31l-7 13 3.4-.8 1.8 3.2 4.6-14.4zM101 31l7 13-3.4-.8-1.8 3.2-4.6-14.4z"
      />
      <path
        class="bow-loop"
        d="M100 30c-5-8-17-9-16-1 1 6 10 5 16 1zM100 30c5-8 17-9 16-1-1 6-10 5-16 1z"
      />
      <path class="bow-fold" d="M98 29c-3-3-8-4-10-2M102 29c3-3 8-4 10-2" />
      <circle class="bow-knot" cx="100" cy="30" r="2.8" />
    </g>

    <circle
      class="bauble-glass"
      cx="100"
      cy="144"
      r="84"
      fill="url(#{uid}-glass)"
    />

    <g clip-path="url(#{uid}-sphere)">
      <path
        class="bauble-band"
        d="M10 112c50 22 130 22 180 0M10 182c50 22 130 22 180 0"
        stroke="url(#{uid}-gold)"
      />
      <path
        class="bauble-dots"
        d="M22 120h.1M46 128h.1M74 132h.1M126 132h.1M154 128h.1M178 120h.1M22 190h.1M46 198h.1M74 202h.1M126 202h.1M154 198h.1M178 190h.1"
      />
      <ellipse class="bauble-reflection" cx="148" cy="196" rx="34" ry="18" />
    </g>

    <ellipse
      class="bauble-gloss"
      cx="66"
      cy="96"
      rx="30"
      ry="18"
      transform="rotate(-32 66 96)"
    />
    <circle class="bauble-spark" cx="58" cy="88" r="5" />

    <rect
      class="bauble-cap"
      x="80"
      y="44"
      width="40"
      height="22"
      rx="4"
      fill="url(#{uid}-gold)"
    />
    <path
      class="bauble-cap-ridges"
      d="M86 46v18M93 46v18M100 46v18M107 46v18M114 46v18"
    />
    <path
      class="bauble-snow"
      d="M78 48c2-8 12-10 18-6 6-5 16-4 20 0 6-2 10 2 8 7-12 2-34 2-46-1z"
    />

    <path
      class="holly-leaf"
      d="M120 52c10-12 26-12 34-6-4 2-6 6-4 9-4 0-7 3-7 6-4-2-8-1-10 2-2-5-8-8-13-11z"
    />
    <path
      class="holly-leaf"
      d="M118 56c4 14 0 28-8 34 0-4-3-7-6-7 2-4 1-8-2-10 3-3 4-8 4-11 4 0 9-2 12-6z"
    />
    <circle class="holly-berry" cx="118" cy="56" r="5" />
    <circle class="holly-berry" cx="127" cy="60" r="4.4" />
    <circle class="holly-berry" cx="114" cy="64" r="4" />
  </svg>

  <div class="bauble-mark">
    <div class="mark-shadow"><LogoMarkCircle /></div>
    <div class="mark-gold"><LogoMarkCircle /></div>
  </div>

  {#each glints as glint (glint.key)}
    <span
      class="bauble-glint"
      style="--glint-x: {glint.x}%; --glint-y: {glint.y}%; --glint-delay: {glint.delay}s"
    ></span>
  {/each}
</div>

<style>
  .trakt-christmas-bauble {
    position: relative;
    width: 100%;
    height: 100%;

    transform-origin: 50% -40%;
    animation: bauble-swing 5s ease-in-out infinite;

    .bauble-art {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .glass-shine {
      stop-color: var(--red-200);
    }

    .glass-light {
      stop-color: var(--red-400);
    }

    .glass-mid {
      stop-color: var(--red-700);
    }

    .glass-dark {
      stop-color: var(--red-950);
    }

    .gold-dark {
      stop-color: var(--orange-700);
    }

    .gold-mid {
      stop-color: var(--yellow-400);
    }

    .gold-light {
      stop-color: var(--yellow-100);
    }

    .bauble-cord,
    .bauble-cord-twist,
    .bauble-cord-shine {
      fill: none;
      stroke-linecap: round;
    }

    .bauble-cord {
      stroke: var(--orange-600);
      stroke-width: 3.6;
    }

    .bauble-cord-twist {
      stroke: var(--yellow-300);
      stroke-width: 3.6;
      stroke-dasharray: 2.6 1.6;
    }

    .bauble-cord-shine {
      stroke: var(--yellow-50);
      stroke-width: 0.8;
      stroke-dasharray: 1 3.2;
      opacity: 0.8;
    }

    .bauble-bow {
      transform: scale(1.5);
      transform-origin: 100px 30px;
    }

    .bow-tail {
      fill: var(--red-700);
      stroke: var(--red-900);
      stroke-width: 0.8;
    }

    .bow-loop {
      fill: var(--red-500);
      stroke: var(--red-800);
      stroke-width: 0.8;
    }

    .bow-fold {
      fill: none;
      stroke: var(--red-800);
      stroke-width: 0.8;
      stroke-linecap: round;
    }

    .bow-knot {
      fill: var(--red-400);
      stroke: var(--red-800);
      stroke-width: 0.8;
    }

    .bauble-loop {
      fill: none;
      stroke: var(--yellow-400);
      stroke-width: 3;
    }

    .bauble-band {
      fill: none;
      stroke-width: 5;
    }

    .bauble-dots {
      fill: none;
      stroke: var(--yellow-200);
      stroke-width: 5;
      stroke-linecap: round;
    }

    .bauble-reflection {
      fill: var(--red-300);
      opacity: 0.25;
    }

    .bauble-gloss {
      fill: var(--shade-10);
      opacity: 0.35;
    }

    .bauble-spark {
      fill: var(--shade-10);
      opacity: 0.9;
    }

    .bauble-cap-ridges {
      fill: none;
      stroke: var(--orange-800);
      stroke-width: 1.2;
      opacity: 0.6;
    }

    .bauble-snow {
      fill: var(--shade-10);
    }

    .holly-leaf {
      fill: var(--green-700);
      stroke: var(--green-900);
      stroke-width: 1;
    }

    .holly-berry {
      fill: var(--red-500);
      stroke: var(--red-800);
      stroke-width: 1;
    }

    .bauble-mark {
      position: absolute;
      inset: 38% 28% 18%;

      :global(svg) {
        width: 100%;
        height: 100%;
      }
    }

    .mark-shadow,
    .mark-gold {
      position: absolute;
      inset: 0;
    }

    .mark-shadow {
      --circle-mark-fill: var(--red-950);
      transform: translate(var(--ni-2), var(--ni-2));
      opacity: 0.7;
    }

    .mark-gold {
      --circle-mark-fill: var(--yellow-100);
      filter: drop-shadow(0 0 var(--ni-8) var(--yellow-400));
    }

    .bauble-glint {
      position: absolute;
      top: var(--glint-y);
      left: var(--glint-x);

      width: var(--ni-24);
      height: var(--ni-24);
      margin: calc(var(--ni-12) * -1);

      background: var(--yellow-50);
      clip-path: polygon(
        50% 0,
        58% 42%,
        100% 50%,
        58% 58%,
        50% 100%,
        42% 58%,
        0 50%,
        42% 42%
      );
      filter: drop-shadow(0 0 var(--ni-4) var(--yellow-300));

      animation: bauble-glint 3.2s ease-in-out var(--glint-delay) infinite both;
    }
  }

  @keyframes bauble-swing {
    0%,
    100% {
      transform: rotate(-3deg);
    }
    50% {
      transform: rotate(3deg);
    }
  }

  @keyframes bauble-glint {
    0%,
    60%,
    100% {
      opacity: 0;
      transform: scale(0.2) rotate(0deg);
    }
    30% {
      opacity: 1;
      transform: scale(1) rotate(45deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-christmas-bauble,
    .trakt-christmas-bauble .bauble-glint {
      animation: none;
    }
  }
</style>
