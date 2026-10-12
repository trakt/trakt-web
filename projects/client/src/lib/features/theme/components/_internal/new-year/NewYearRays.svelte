<div class="trakt-new-year-rays"></div>

<style>
  .trakt-new-year-rays {
    --rays-size: calc(var(--hero-size) * 3.2);

    width: var(--rays-size);
    height: var(--rays-size);

    background: repeating-conic-gradient(
      from 0deg,
      color-mix(in srgb, var(--purple-200) 22%, transparent) 0deg 6deg,
      transparent 6deg 18deg
    );
    mask-image: radial-gradient(circle, black 10%, transparent 68%);

    animation:
      rays-in 1200ms ease-out both,
      rays-spin 60s linear infinite;
  }

  @keyframes rays-in {
    from {
      opacity: 0;
      scale: 0.4;
    }
  }

  @keyframes rays-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-new-year-rays {
      animation: none;
    }
  }
</style>
