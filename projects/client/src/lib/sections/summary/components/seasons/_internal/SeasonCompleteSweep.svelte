<script lang="ts" module>
  const SPARKLE_COUNT = 6;

  function sparkles() {
    return Array.from({ length: SPARKLE_COUNT }, (_, index) => {
      const angle = -Math.PI / 2 + ((index - (SPARKLE_COUNT - 1) / 2) * Math.PI) /
          (SPARKLE_COUNT + 1);
      return { x: Math.cos(angle), y: Math.sin(angle) };
    });
  }
</script>

<script lang="ts">
  const burst = sparkles();
</script>

<div class="trakt-season-complete-sweep" aria-hidden="true">
  <span class="sweep-shine"></span>

  {#each burst as sparkle, index (index)}
    <svg
      class="sweep-sparkle"
      style="--sparkle-x: {sparkle.x}; --sparkle-y: {sparkle.y};"
      viewBox="0 0 24 24"
      width="10"
      height="10"
    >
      <path
        d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z"
      />
    </svg>
  {/each}
</div>

<style>
  .trakt-season-complete-sweep {
    --sweep-delay: 180ms;

    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .sweep-shine {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: var(--border-radius-tag, var(--border-radius-m));

    &::after {
      content: "";
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      width: 40%;
      background: linear-gradient(
        100deg,
        transparent,
        color-mix(in srgb, var(--shade-10) 70%, transparent),
        transparent
      );
      animation: sweep-shine 700ms var(--sweep-delay) ease-in-out both;
    }
  }

  .sweep-sparkle {
    position: absolute;
    top: 50%;
    inset-inline-end: 0;
    margin-top: calc(var(--ni-10) / -2);
    fill: var(--yellow-400);
    animation: sweep-sparkle 700ms calc(var(--sweep-delay) + 520ms)
      cubic-bezier(0.2, 0.8, 0.3, 1) both;
  }

  @keyframes sweep-shine {
    from {
      transform: translateX(calc(var(--rtl-sign) * -100%));
    }
    to {
      transform: translateX(calc(var(--rtl-sign) * 250%));
    }
  }

  @keyframes sweep-sparkle {
    0% {
      opacity: 0;
      transform: translate(0, 0) scale(0.3) rotate(0);
    }
    25% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(
          calc(var(--rtl-sign) * var(--sparkle-x) * var(--ni-24)),
          calc(var(--sparkle-y) * var(--ni-24))
        )
        scale(1) rotate(90deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-season-complete-sweep {
      display: none;
    }
  }
</style>
