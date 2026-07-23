<script lang="ts">
  type SkeletonProps = {
    width?: string;
    height?: string;
    radius?: string;
  };

  const { width, height, radius }: SkeletonProps = $props();
</script>

<span
  class="trakt-skeleton"
  style:--skeleton-width={width}
  style:--skeleton-height={height}
  style:--skeleton-radius={radius}
></span>

<style lang="scss">
  .trakt-skeleton {
    display: block;

    width: var(--skeleton-width, 100%);
    height: var(--skeleton-height, var(--ni-16));

    border-radius: var(--skeleton-radius, var(--border-radius-s));
    outline: var(--border-thickness-xxs) solid var(--color-skeleton-outline);
    outline-offset: calc(-1 * var(--border-thickness-xxs));
    background-color: var(
      --color-skeleton-background,
      color-mix(in srgb, var(--color-border) 80%, transparent)
    );

    animation: var(
      --animation-decorative,
      pulse calc(5 * var(--transition-increment)) ease-in-out infinite
        alternate
    );
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-skeleton {
      animation: none;
    }
  }
</style>
