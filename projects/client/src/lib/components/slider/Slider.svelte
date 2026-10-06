<script lang="ts">
  import { Slider } from "bits-ui";
  import { DEFAULT_TICK_COUNT } from "./_internal/constants";
  import { defaultFormatter } from "./_internal/defaultFormatter";
  import { getTickLabelIndices } from "./_internal/getTickLabelIndices";
  import { isFullRange } from "./isFullRange";
  import ThumbIcon from "./_internal/icons/ThumbIcon.svelte";
  import type { SliderProps } from "./models/SliderProps";

  const {
    range,
    value,
    step,
    ticks,
    onChange,
    onCommit,
    disabled = false,
  }: SliderProps = $props();

  const tickCount = $derived(ticks?.count ?? DEFAULT_TICK_COUNT);
  const tickFormatter = $derived(ticks?.formatter ?? defaultFormatter);

  let internalValue = $derived([value.min, value.max]);
  const isActive = $derived(
    !isFullRange({
      value: {
        min: internalValue.at(0) ?? range.min,
        max: internalValue.at(1) ?? range.max,
      },
      range,
    }),
  );

  function toTickEdge(position: number, total: number) {
    if (position === 0) return "start";
    if (position === total - 1) return "end";

    return undefined;
  }

  function getValue() {
    return internalValue;
  }

  function setValue(newValue: number[]) {
    internalValue = newValue;
    const [min, max] = newValue;
    onChange({ min, max });
  }
</script>

<div class="trakt-slider-container">
  <Slider.Root
    {step}
    min={range.min}
    max={range.max}
    type="multiple"
    bind:value={getValue, setValue}
    onValueCommit={(value) => {
      const [min, max] = value;
      onCommit?.({ min, max });
    }}
    class="trakt-slider"
    data-active={isActive}
    thumbPositioning="exact"
    {disabled}
  >
    {#snippet children({ tickItems, thumbItems })}
      <span class="trakt-slider-track">
        <Slider.Range class="trakt-slider-range" />
      </span>
      {#each thumbItems as { index } (index)}
        <Slider.Thumb {index} class="trakt-slider-thumb">
          <ThumbIcon />
        </Slider.Thumb>
      {/each}
      {@const labelIndices = getTickLabelIndices({
        total: tickItems.length,
        count: tickCount,
      })}
      {@const labels = tickItems.filter((_, i) => labelIndices.includes(i))}
      {#each labels as { value, index }, position (index)}
        <Slider.TickLabel
          {index}
          position="bottom"
          class="trakt-slider-tick-label"
        >
          <span
            class="tick-label-text tag secondary"
            data-edge={toTickEdge(position, labels.length)}>{tickFormatter(value)}</span
          >
        </Slider.TickLabel>
      {/each}
    {/snippet}
  </Slider.Root>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-slider-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  :global(.trakt-slider) {
    --slider-thumb-size: var(--ni-20);
    --slider-track-height: var(--ni-6);
    --slider-hit-size: var(--ni-40);

    position: relative;

    display: flex;
    width: calc(100% - var(--slider-thumb-size));
    min-height: var(--slider-hit-size);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    align-items: center;
    user-select: none;
  }

  :global(.trakt-slider[data-active="false"] .trakt-slider-range) {
    background-color: var(--color-text-secondary);
    opacity: 0.4;
  }

  :global(.trakt-slider[data-disabled] .trakt-slider-track) {
    cursor: not-allowed;
    background-color: var(--color-surface-button-disabled);
  }

  :global(.trakt-slider[data-disabled] .trakt-slider-range) {
    background-color: var(--color-foreground-button-disabled);
  }

  :global(.trakt-slider[data-disabled] .trakt-slider-thumb) {
    background-color: var(--color-foreground-button-disabled);
  }

  .trakt-slider-track {
    position: relative;
    height: var(--slider-track-height);
    flex-grow: 1;
    cursor: pointer;
    overflow: hidden;
    border-radius: var(--border-radius-xl);

    background-color: var(--color-filter-slider-track);

    :global(.trakt-slider-range) {
      position: absolute;
      height: 100%;
      background-color: var(--purple-500);

      transition: var(--transition-increment) ease-in-out;
      transition-property: background-color, opacity;
    }
  }

  :global(.trakt-slider-thumb) {
    z-index: var(--layer-raised);

    display: flex;
    justify-content: center;
    align-items: center;

    width: var(--slider-thumb-size);
    height: var(--slider-thumb-size);
    border-radius: 50%;

    background-color: var(--purple-500);
    color: var(--shade-10);
    box-shadow: var(--shadow-raised);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, outline-width, scale;

    :global(svg) {
      width: calc(var(--slider-thumb-size) * 0.4);
      height: calc(var(--slider-thumb-size) * 0.4);
    }

    &::before {
      content: "";
      position: absolute;
      inset: calc((var(--slider-thumb-size) - var(--slider-hit-size)) / 2);
      border-radius: 50%;
    }

    @include for-mouse {
      &:hover {
        scale: 1.15;
      }
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--shade-10);
    }
  }

  :global(.trakt-slider-tick-label) {
    margin-top: calc(
      var(--gap-xs) - (var(--slider-hit-size) - var(--slider-thumb-size)) / 2
    );
  }

  .tick-label-text {
    display: inline-block;
    white-space: nowrap;

    &[data-edge="start"] {
      translate: calc(
          var(--rtl-sign, 1) * (50% - var(--slider-thumb-size) / 2)
        )
        0;
    }

    &[data-edge="end"] {
      translate: calc(
          var(--rtl-sign, 1) * (var(--slider-thumb-size) / 2 - 50%)
        )
        0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.trakt-slider-thumb),
    .trakt-slider-track :global(.trakt-slider-range) {
      transition: none;
    }
  }
</style>
