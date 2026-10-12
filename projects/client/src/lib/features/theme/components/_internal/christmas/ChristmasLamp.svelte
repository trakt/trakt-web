<script lang="ts">
  const uid = $props.id();
</script>

<svg class="trakt-christmas-lamp" viewBox="0 0 40 120" aria-hidden="true">
  <defs>
    <radialGradient id="{uid}-lamp-glow">
      <stop offset="0" class="glow-core" />
      <stop offset="1" class="glow-edge" />
    </radialGradient>
  </defs>

  <ellipse class="lamp-pool" cx="20" cy="117" rx="34" ry="5" />
  <circle
    class="lamp-glow"
    cx="20"
    cy="24"
    r="22"
    fill="url(#{uid}-lamp-glow)"
  />

  <path class="lamp-iron" d="M14 118h12l-2-6h-8z" />
  <path class="lamp-iron" d="M18.4 112V40h3.2v72z" />
  <path class="lamp-iron" d="M16 44h8l-1.4-4h-5.2z" />
  <path class="lamp-arm" d="M21.6 60c6-2 8-8 6-12" />

  <path class="lamp-glass" d="M13 38l-2-16h18l-2 16z" />
  <path class="lamp-frame" d="M13 38l-2-16h18l-2 16zM20 22v16" />
  <path class="lamp-iron" d="M9 22h22l-5-7H14z" />
  <circle class="lamp-iron" cx="20" cy="13" r="2" />
  <path
    class="lamp-snow"
    d="M9.4 21c-.4-3 2-6 5-6.4 2-1.4 9-1.4 11 0 3 .4 5.4 3.4 5 6.4z"
  />

  <path class="lamp-garland" d="M18 50c-4 2-4 6 0 7m4-7c4 2 4 6 0 7" />
  <path
    class="lamp-bow"
    d="M20 47l-5-3.4v6.8zm0 0l5-3.4v6.8zm-1.4 0l-2.6 8h2zm2.8 0l2.6 8h-2z"
  />
  <circle class="lamp-bow" cx="20" cy="47" r="1.6" />
</svg>

<style>
  .trakt-christmas-lamp {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;

    .glow-core {
      stop-color: var(--yellow-200);
      stop-opacity: 0.55;
    }

    .glow-edge {
      stop-color: var(--orange-400);
      stop-opacity: 0;
    }

    .lamp-glow {
      transform-box: fill-box;
      transform-origin: center;
      animation: lamp-flicker 3.2s ease-in-out infinite;
    }

    .lamp-pool {
      fill: var(--yellow-200);
      opacity: 0.3;
      filter: blur(var(--ni-3));
    }

    .lamp-iron {
      fill: var(--shade-920);
    }

    .lamp-frame {
      fill: none;
      stroke: var(--shade-920);
      stroke-width: 1.2;
    }

    .lamp-arm {
      fill: none;
      stroke: var(--shade-920);
      stroke-width: 1.4;
      stroke-linecap: round;
    }

    .lamp-glass {
      fill: var(--yellow-100);
      filter: drop-shadow(0 0 var(--ni-6) var(--yellow-300));
    }

    .lamp-snow {
      fill: var(--shade-10);
    }

    .lamp-garland {
      fill: none;
      stroke: var(--green-700);
      stroke-width: 2.4;
      stroke-linecap: round;
    }

    .lamp-bow {
      fill: var(--red-500);
    }
  }

  @keyframes lamp-flicker {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    45% {
      opacity: 0.85;
      transform: scale(0.96);
    }
    55% {
      opacity: 1;
      transform: scale(1.02);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-christmas-lamp .lamp-glow {
      animation: none;
    }
  }
</style>
