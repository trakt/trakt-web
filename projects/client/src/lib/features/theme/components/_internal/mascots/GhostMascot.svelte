<svg class="trakt-ghost-mascot" viewBox="0 0 40 44" aria-hidden="true">
  <path
    class="ghost-body"
    d="M20 2C10.6 2 4 9.2 4 18.5V38c0 1.6 1.8 2.4 3 1.4l3-2.6 3.4 3c.9.8 2.3.8 3.2 0L20 36.8l3.4 3c.9.8 2.3.8 3.2 0l3.4-3 3 2.6c1.2 1 3 .2 3-1.4V18.5C36 9.2 29.4 2 20 2z"
  />
  <g class="ghost-eyes">
    <ellipse cx="15" cy="19" rx="2.2" ry="2.8" />
    <ellipse cx="25" cy="19" rx="2.2" ry="2.8" />
  </g>
  <circle class="ghost-shine" cx="15.8" cy="18" r="0.8" />
  <circle class="ghost-shine" cx="25.8" cy="18" r="0.8" />
  <ellipse class="ghost-blush" cx="11.5" cy="24" rx="2.4" ry="1.3" />
  <ellipse class="ghost-blush" cx="28.5" cy="24" rx="2.4" ry="1.3" />
  <ellipse class="ghost-mouth" cx="20" cy="26" rx="1.6" ry="2" />
</svg>

<style>
  .trakt-ghost-mascot {
    width: 100%;
    height: 100%;

    filter: drop-shadow(0 var(--ni-2) var(--ni-4) var(--color-shadow));
    animation: ghost-float 3.2s ease-in-out infinite;

    .ghost-body {
      fill: var(--shade-10);
    }

    .ghost-eyes,
    .ghost-mouth {
      fill: var(--shade-920);
    }

    .ghost-eyes {
      transform-box: fill-box;
      transform-origin: center;
      animation: ghost-blink 4.8s infinite;
    }

    .ghost-shine {
      fill: var(--shade-10);
    }

    .ghost-blush {
      fill: var(--purple-300);
      opacity: 0.6;
    }

    .ghost-mouth {
      transform-box: fill-box;
      transform-origin: center;
      transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    &:hover .ghost-mouth {
      transform: scale(1.6, 2);
    }
  }

  @keyframes ghost-float {
    0%,
    100% {
      transform: translateY(0) rotate(-4deg);
    }
    50% {
      transform: translateY(calc(-1 * var(--ni-6))) rotate(4deg);
    }
  }

  @keyframes ghost-blink {
    0%,
    92%,
    100% {
      transform: scaleY(1);
    }
    95% {
      transform: scaleY(0.1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-ghost-mascot,
    .trakt-ghost-mascot .ghost-eyes {
      animation: none;
    }
  }
</style>
