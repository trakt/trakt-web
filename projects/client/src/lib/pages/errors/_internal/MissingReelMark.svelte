<!--
  404: a strip of film with its middle frame gone. The two frames that survived
  are solid, the one in between is a dotted hole that keeps breathing - the
  reel is threaded, the footage is not there.
-->
<svg
  width="48"
  height="48"
  viewBox="0 0 48 48"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect
    x="4"
    y="13"
    width="40"
    height="22"
    rx="2.5"
    stroke="currentColor"
    stroke-width="2"
  />

  <g fill="currentColor" opacity="0.22">
    <rect x="5.6" y="19.5" width="11.1" height="9" rx="1" />
    <rect x="31.4" y="19.5" width="11.1" height="9" rx="1" />
  </g>

  <g fill="currentColor" opacity="0.8">
    <rect x="6.6" y="15" width="3" height="2.5" rx="0.6" />
    <rect x="13.6" y="15" width="3" height="2.5" rx="0.6" />
    <rect x="20.6" y="15" width="3" height="2.5" rx="0.6" />
    <rect x="27.6" y="15" width="3" height="2.5" rx="0.6" />
    <rect x="34.6" y="15" width="3" height="2.5" rx="0.6" />
    <rect x="6.6" y="30.5" width="3" height="2.5" rx="0.6" />
    <rect x="13.6" y="30.5" width="3" height="2.5" rx="0.6" />
    <rect x="20.6" y="30.5" width="3" height="2.5" rx="0.6" />
    <rect x="27.6" y="30.5" width="3" height="2.5" rx="0.6" />
    <rect x="34.6" y="30.5" width="3" height="2.5" rx="0.6" />
  </g>

  <g stroke="currentColor" stroke-width="1.5" opacity="0.5">
    <path d="M17.3 19.5v9" />
    <path d="M30.7 19.5v9" />
  </g>

  <rect
    class="void"
    x="19.3"
    y="20.6"
    width="9.4"
    height="6.8"
    rx="1"
    stroke="currentColor"
    stroke-width="1.2"
    stroke-dasharray="2 2.5"
  />
</svg>

<style lang="scss">
  @keyframes missing-frame-breathe {
    0%,
    100% {
      opacity: 0.25;
    }
    50% {
      opacity: 0.8;
    }
  }

  .void {
    opacity: 0.55;
    animation: missing-frame-breathe 3600ms ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .void {
      animation: none;
    }
  }
</style>
