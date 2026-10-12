<svg class="trakt-santa-hat-mascot" viewBox="0 0 48 40" aria-hidden="true">
  <path
    class="hat-body"
    d="M7 31C8 19 15 8 26 5c7-2 14 2 17 11l-3.5 2c-2-5-6-7-9.5-5.5C33 18 36 24 37 31z"
  />
  <path
    class="hat-fold"
    d="M30 12.5c3 5.5 6 11.5 7 18.5h-4c-.6-6.4-2.4-12.4-5.2-17.4z"
  />
  <rect class="hat-fur" x="3" y="28" width="38" height="8" rx="4" />
  <circle class="hat-fur hat-pompom" cx="41" cy="19" r="4.2" />
</svg>

<style>
  .trakt-santa-hat-mascot {
    width: 100%;
    height: 100%;

    filter: drop-shadow(0 var(--ni-2) var(--ni-4) var(--color-shadow));

    .hat-body {
      fill: var(--red-500);
    }

    .hat-fold {
      fill: var(--red-700);
    }

    .hat-fur {
      fill: var(--shade-10);
    }

    .hat-pompom {
      transform-box: fill-box;
      transform-origin: center top;
      animation: pompom-bob 2.6s ease-in-out infinite;
    }
  }

  @keyframes pompom-bob {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(var(--ni-2));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-santa-hat-mascot .hat-pompom {
      animation: none;
    }
  }
</style>
