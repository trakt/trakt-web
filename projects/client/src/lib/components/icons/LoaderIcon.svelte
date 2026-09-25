<svg
  class="trakt-loader-icon"
  width="24"
  height="24"
  viewBox="0 0 61 61"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    class="loader-ring"
    pathLength="100"
    d="M37.12 3.44A27.5 27.5 0 1 0 56.56 37.12"
  />
  <path
    class="loader-check"
    style:--pop-step={0}
    d="M30.559 22.2299L27.3451 26.0599L19.685 19.6322L22.8988 15.8021L30.559 22.2299Z"
  />
  <path
    class="loader-check"
    style:--pop-step={1}
    d="M57.5434 5.70935L31.8305 36.3529L39.4906 42.7806L36.2768 46.6107L13.2563 27.2943L16.4701 23.4642L28.0004 33.139L53.7133 2.49548L57.5434 5.70935Z"
  />
  <path
    class="loader-check"
    style:--pop-step={2}
    d="M60.3432 17.85L42.6664 38.9164L38.8363 35.7015L56.5131 14.6361L60.3432 17.85Z"
  />
</svg>

<style>
  .trakt-loader-icon {
    --loader-duration: 1.4s;
  }

  .loader-ring {
    fill: none;
    stroke: currentColor;
    stroke-width: 5;
    stroke-dasharray: 100 100;

    animation: loader-ring var(--loader-duration) cubic-bezier(0.3, 0, 0.2, 1)
      infinite;
  }

  .loader-check {
    fill: currentColor;

    transform-box: view-box;
    transform-origin: 30px 36px;

    animation: loader-pop var(--loader-duration)
      cubic-bezier(0.34, 1.56, 0.64, 1) infinite backwards;
    animation-delay: calc(var(--loader-duration) * 0.04 * var(--pop-step));
  }

  @keyframes loader-ring {
    0% {
      stroke-dashoffset: 100;
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
