<script lang="ts">
  import { Slider } from "bits-ui";
  import { DEFAULT_TICK_COUNT } from "./_internal/constants";
  import { defaultFormatter } from "./_internal/defaultFormatter";
  import { getTickLabelIndices } from "./_internal/getTickLabelIndices";
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

  let dragValue = $state<number[] | null>(null);
  const internalValue = $derived(dragValue ?? [value.min, value.max]);

  function getValue() {
    return internalValue;
  }

  function setValue(newValue: number[]) {
    dragValue = newValue;
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
      dragValue = null;
      const [min, max] = value;
      onCommit?.({ min, max });
    }}
    class="trakt-slider"
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
      {#each tickItems.filter( (_, i) => getTickLabelIndices( { total: tickItems.length, count: tickCount }, ).includes(i), ) as { value, index } (index)}
        <Slider.TickLabel
          {index}
          position="bottom"
          class="trakt-slider-tick-label"
        >
          <span class="secondary">{tickFormatter(value)}</span>
        </Slider.TickLabel>
      {/each}
    {/snippet}
  </Slider.Root>
</div>

<style>
  .trakt-slider-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  :global(.trakt-slider) {
    --slider-thumb-size: var(--ni-20);
    --slider-track-height: var(--ni-10);

    position: relative;

    display: flex;
    width: calc(100% - var(--slider-thumb-size));

    align-items: center;
    user-select: none;

    &[data-disabled] {
      :global(.trakt-slider-track) {
        cursor: not-allowed;
        background-color: var(--color-surface-button-disabled);

        :global(.trakt-slider-range) {
          background-color: var(--color-foreground-button-disabled);
        }
      }

      :global(.trakt-slider-thumb) {
        background-color: var(--color-foreground-button-disabled);
      }
    }
  }

  .trakt-slider-track {
    position: relative;

    height: var(--slider-track-height);

    flex-grow: 1;
    cursor: pointer;
    overflow: hidden;

    border-radius: var(--border-radius-xl);
    background-color: var(--shade-100);

    :global(.trakt-slider-range) {
      position: absolute;
      height: 100%;
      background-color: var(--blue-500);
    }
  }

  :global(.trakt-slider-thumb) {
    -webkit-tap-highlight-color: transparent;

    z-index: var(--layer-raised);
    display: flex;
    justify-content: center;
    align-items: center;

    width: var(--slider-thumb-size);
    height: var(--slider-thumb-size);

    cursor: pointer;
    border-radius: 50%;

    background-color: var(--blue-500);
    box-shadow: var(--shadow-raised);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, outline-width;

    :global(svg) {
      --thumb-icon-size: calc(var(--slider-thumb-size) / 3);
      width: var(--thumb-icon-size);
      height: var(--thumb-icon-size);

      color: var(--shade-10);
    }

    &:hover {
      background-color: var(--blue-600);
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--shade-10);
    }
  }

  :global(.trakt-slider-tick-label) {
    margin-top: var(--gap-s);
  }
</style>
