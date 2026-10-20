<svg
  class="trakt-yir-top-logo"
  viewBox="0 0 48 48"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
>
  <defs>
    <linearGradient
      id="yir-top-logo-gradient"
      x1="0"
      y1="0"
      x2="48"
      y2="48"
      gradientUnits="userSpaceOnUse"
    >
      <stop class="stop-start" offset="0%" />
      <stop class="stop-end" offset="100%" />
    </linearGradient>
  </defs>
  <rect class="logo-bg" width="48" height="48" rx="10.8" />
  <g
    class="logo-mark"
    transform="translate(9.600 9.600) scale(0.47213)"
  >
    <path d="M56.00 38.95A27.5 27.5 0 1 1 36.19 3.20" />
    <path d="M16.93 27.11L35.82 42.96M29.92 34.75L53.89 6.17M56.69 18.31L42.49 35.24M26.88 22.41L23.36 19.45" />
  </g>
</svg>

<style lang="scss">
  .trakt-yir-top-logo {
    display: block;
    width: 100%;
    height: 100%;
  }

  .stop-start {
    stop-color: var(--purple-500);
  }

  .stop-end {
    stop-color: var(--red-500);
  }

  .logo-bg {
    fill: url(#yir-top-logo-gradient);
  }

  .logo-mark {
    fill: none;
    stroke: var(--shade-10);
    stroke-width: 6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
