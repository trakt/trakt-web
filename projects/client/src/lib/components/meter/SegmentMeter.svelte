<script lang="ts">
  type SegmentMeterProps = {
    filled: number;
    total?: number;
    size?: "small" | "large";
  };

  const { filled, total = 4, size = "small" }: SegmentMeterProps = $props();

  const segments = $derived(
    Array.from({ length: total }, (_, index) => ({
      index,
      isFilled: index < filled,
    })),
  );
</script>

<span
  class="trakt-segment-meter"
  data-size={size}
  style="--segment-count: {total}"
  aria-hidden="true"
>
  {#each segments as segment (segment.index)}
    <span
      class="meter-segment"
      class:is-filled={segment.isFilled}
      style="--segment-index: {segment.index}"
    ></span>
  {/each}
</span>

<style lang="scss">
  .trakt-segment-meter {
    --segment-off: color-mix(
      in srgb,
      var(--color-text-primary) 14%,
      transparent
    );
    --segment-on: var(--color-text-emphasis);

    display: inline-grid;
    grid-template-columns: repeat(var(--segment-count), minmax(0, 1fr));
    align-items: center;
    flex-shrink: 0;

    .meter-segment {
      display: block;
      background: var(--segment-off);

      &.is-filled {
        background: var(--segment-on);
        animation: fill-segment calc(3 * var(--transition-increment)) ease-out
          both;
        animation-delay: calc(
          var(--segment-index) * var(--transition-increment) * 0.6
        );
      }
    }

    &[data-size="small"] {
      grid-template-columns: repeat(var(--segment-count), var(--ni-8));
      gap: var(--ni-2);

      .meter-segment {
        height: var(--ni-4);
        border-radius: var(--ni-2);
      }
    }

    &[data-size="large"] {
      gap: var(--gap-xxs);
      width: 100%;

      .meter-segment {
        height: var(--ni-6);
        border-radius: var(--ni-3);
      }
    }
  }

  @keyframes fill-segment {
    from {
      background: var(--segment-off);
      transform: scaleX(0.4);
    }

    to {
      background: var(--segment-on);
      transform: scaleX(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-segment-meter .meter-segment.is-filled {
      animation: none;
    }
  }
</style>
