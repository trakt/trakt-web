<script lang="ts">
  const { size = "card" }: { size?: "card" | "drawer" } = $props();
</script>

<span class="trakt-match-ring-skeleton" data-size={size} aria-hidden="true">
  <svg viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="16" />
  </svg>
</span>

<style>
  .trakt-match-ring-skeleton {
    display: inline-flex;
    flex-shrink: 0;

    width: var(--ni-44);
    height: var(--ni-44);

    &[data-size="drawer"] {
      width: var(--ni-56);
      height: var(--ni-56);
    }

    animation: pulse calc(5 * var(--transition-increment)) ease-in-out infinite
      alternate;
  }

  svg {
    width: 100%;
    height: 100%;
    fill: none;
    stroke-width: 4;
    stroke: color-mix(in srgb, var(--color-border) 80%, transparent);
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-match-ring-skeleton {
      animation: none;
    }
  }
</style>
