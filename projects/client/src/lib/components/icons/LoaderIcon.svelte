<svg
  class="trakt-loader-icon"
  width="24"
  height="24"
  viewBox="-1 -1 63 63"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    class="loader-ring"
    pathLength="100"
    d="M36.19 3.20A27.5 27.5 0 1 0 56.00 38.95"
  />
  <path class="loader-check" style:--pop-step={0} d="M26.88 22.41L23.36 19.45" />
  <path
    class="loader-check"
    style:--pop-step={1}
    d="M16.93 27.11L35.82 42.96M29.92 34.75L53.89 6.17"
  />
  <path class="loader-check" style:--pop-step={2} d="M56.69 18.31L42.49 35.24" />
</svg>

<style>
  .trakt-loader-icon {
    --loader-duration: 1.4s;
  }

  .loader-ring {
    fill: none;
    stroke: currentColor;
    stroke-width: 6;
    stroke-linecap: round;
    stroke-dasharray: 100 100;

    animation: loader-ring var(--loader-duration) cubic-bezier(0.3, 0, 0.2, 1)
      infinite;
  }

  .loader-check {
    fill: none;
    stroke: currentColor;
    stroke-width: 6;
    stroke-linecap: round;
    stroke-linejoin: round;

    transform-box: view-box;
    transform-origin: 30px 36px;

    animation: loader-pop var(--loader-duration)
      cubic-bezier(0.34, 1.56, 0.64, 1) infinite backwards;
    animation-delay: calc(var(--loader-duration) * 0.04 * var(--pop-step));
  }

  @keyframes loader-ring {
    0% {
      stroke-dashoffset: 100;
      opacity: 0;
    }
    3% {
      opacity: 1;
    }
    20%,
    74% {
      stroke-dashoffset: 0;
      opacity: 1;
    }
    90%,
    100% {
      stroke-dashoffset: 0;
      opacity: 0;
    }
  }

  @keyframes loader-pop {
    0%,
    10% {
      opacity: 0;
      transform: scale(0.4);
    }
    24%,
    72% {
      opacity: 1;
      transform: scale(1);
    }
    86%,
    100% {
      opacity: 0;
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-loader-icon {
      animation: loader-pulse 2.4s ease-in-out infinite;
    }

    .loader-ring,
    .loader-check {
      animation: none;
    }

    .loader-ring {
      stroke-dashoffset: 0;
    }

    @keyframes loader-pulse {
      0%,
      100% {
        opacity: 0.25;
      }
      50% {
        opacity: 1;
      }
    }
  }
</style>
