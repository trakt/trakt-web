<script lang="ts">
  const {
    countWidth = "3.5ch",
    labelWidth = "8.5ch",
  }: { countWidth?: string; labelWidth?: string } = $props();
</script>

<div
  class="trakt-avatar-pill-skeleton"
  role="status"
  aria-busy="true"
  style:--skeleton-count-width={countWidth}
  style:--skeleton-label-width={labelWidth}
>
  <span class="skeleton-count"></span>
  <span class="skeleton-label"></span>
</div>

<style lang="scss">
  .trakt-avatar-pill-skeleton {
    --height-watched-by-label: calc(var(--font-size-text) + var(--ni-2));

    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);
    height: var(--segmented-select-segment-height);
    padding: 0 var(--ni-8);
    box-sizing: border-box;
    border-radius: var(--border-radius-pill);

    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-border) 40%, transparent);

    cursor: default;
    background: color-mix(in srgb, var(--color-foreground) 5%, transparent);

    .skeleton-count {
      width: var(--skeleton-count-width);
    }

    .skeleton-label {
      width: var(--skeleton-label-width);
    }

    span {
      display: inline-block;
      height: var(--height-watched-by-label);
      border-radius: var(--border-radius-xs, var(--ni-4));
      background: color-mix(in srgb, var(--color-foreground) 12%, transparent);

      position: relative;
      overflow: hidden;

      &::after {
        content: "";

        position: absolute;
        top: 0;

        width: 300%;
        height: 100%;

        transform: translateX(100%);

        animation: slide calc(8 * var(--transition-increment)) infinite;

        background: linear-gradient(
          110deg,
          transparent 0%,
          transparent 30%,
          color-mix(in srgb, var(--color-foreground) 25%, transparent) 50%,
          transparent 70%,
          transparent 100%
        );
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-avatar-pill-skeleton span::after {
      animation: none;
    }
  }
</style>
