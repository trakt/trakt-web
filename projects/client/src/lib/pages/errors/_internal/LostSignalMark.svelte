<!--
  Service unreachable: a transmitter still standing, its waves thinning out
  into dots. The near pair pulses, the far pair follows a beat later and never
  quite arrives - the picture of a signal that is being sent but not received.
-->
<svg
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M24 26v14" />
    <path d="M18 40h12" />
    <path class="wave-near" d="M16.2 14.2A11 11 0 0 0 16.2 29.8" />
    <path class="wave-near" d="M31.8 14.2A11 11 0 0 1 31.8 29.8" />
    <path
      class="wave-far"
      d="M10.6 8.6A19 19 0 0 0 10.6 35.4"
      stroke-dasharray="2 6"
    />
    <path
      class="wave-far"
      d="M37.4 8.6A19 19 0 0 1 37.4 35.4"
      stroke-dasharray="2 6"
    />
  </g>
  <circle cx="24" cy="22" r="3" fill="currentColor" />
</svg>

<style lang="scss">
  @keyframes signal-search {
    0%,
    100% {
      opacity: 0.15;
    }
    40% {
      opacity: 0.95;
    }
  }

  .wave-near,
  .wave-far {
    animation: signal-search 3200ms ease-in-out infinite;
  }

  .wave-near {
    opacity: 0.95;
  }

  .wave-far {
    opacity: 0.3;
    animation-delay: 450ms;
  }

  @media (prefers-reduced-motion: reduce) {
    .wave-near,
    .wave-far {
      animation: none;
    }
  }
</style>
