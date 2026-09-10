<!--
  Unexpected error: a clapperboard that snaps shut every few seconds and
  springs back open - the take that has to be shot again.

  The stick is a bar hinged on the board's top-left corner, drawn at rest in
  the open position. Rotating it +14deg about that hinge lays its lower edge
  flat along the board's top edge, which is what the clap keyframes do.
-->
<svg
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect
    x="8"
    y="22"
    width="32"
    height="16"
    rx="2.5"
    stroke="currentColor"
    stroke-width="2"
  />

  <g stroke="currentColor" stroke-width="1.6" opacity="0.4">
    <path d="M12 28h24" />
    <path d="M12 33h24" />
  </g>

  <g class="stick">
    <path
      d="M8.17 16.66 37.27 9.4 38.6 14.74 9.5 22z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="round"
    />

    <g stroke="currentColor" stroke-width="1.6" opacity="0.55">
      <path d="M15.32 20.55 13.99 15.21" />
      <path d="M21.14 19.1 19.81 13.76" />
      <path d="M26.96 17.64 25.63 12.3" />
      <path d="M32.78 16.19 31.45 10.85" />
    </g>
  </g>
</svg>

<style lang="scss">
  @keyframes bad-take-clap {
    0%,
    76%,
    100% {
      transform: rotate(0deg);
    }
    83% {
      transform: rotate(14deg);
    }
    88% {
      transform: rotate(10deg);
    }
    93% {
      transform: rotate(-3deg);
    }
  }

  .stick {
    transform-box: view-box;
    transform-origin: 9.5px 22px;
    animation: bad-take-clap 5s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .stick {
      animation: none;
    }
  }
</style>
