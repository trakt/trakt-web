<!--
  Unexpected error: a clapperboard whose stick claps every few seconds and
  never settles - the take that has to be shot again.
-->
<svg
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M10 23h30a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V23z"
    stroke="currentColor"
    stroke-width="2"
    stroke-linejoin="round"
  />
  <g class="stick">
    <path
      d="M10.6 19.4 39.4 11.7 41 17.5 12.2 25.2z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="round"
    />
    <g stroke="currentColor" stroke-width="1.5" opacity="0.55">
      <path d="M18 17.7 20.2 22.8" />
      <path d="M26 15.6 28.2 20.6" />
      <path d="M34 13.5 36.2 18.5" />
    </g>
  </g>
</svg>

<style lang="scss">
  @keyframes bad-take-clap {
    0%,
    80%,
    100% {
      transform: rotate(0deg);
    }
    88% {
      transform: rotate(-10deg);
    }
    94% {
      transform: rotate(2deg);
    }
  }

  .stick {
    transform-box: view-box;
    transform-origin: 10.6px 19.4px;
    animation: bad-take-clap 5s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .stick {
      animation: none;
    }
  }
</style>
