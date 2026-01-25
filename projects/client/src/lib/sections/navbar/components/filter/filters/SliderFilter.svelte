<script lang="ts">
  import { iffy } from "$lib/utils/function/iffy";
  import { debounce } from "$lib/utils/timing/debounce";
  import { time } from "$lib/utils/timing/time";
  import { Slider } from "bits-ui";
  import SliderThumbIcon from "./_internal/SliderThumbIcon.svelte";

  type Range = {
    min: number;
    max: number;
  };

  const {
    formatLabel,
    range,
    defaultValue,
    step = 1,
    tickLabelsCount = 5,
    onChange,
  }: {
    formatLabel: (range: Range) => string;
    range: Range;
    defaultValue: Range;
    step?: number;
    tickLabelsCount?: number;
    onChange: (range?: Range) => void;
  } = $props();

  let value = $state(iffy(() => [defaultValue.min, defaultValue.max]));

  const debouncedOnChange = debounce(
    (value?: Range) => onChange(value),
    time.fps(30),
  );

  function getValue() {
    return value;
  }

  function setValue(newValue: number[]) {
    value = newValue;

    const [min, max] = value;
    const isDefault = min === defaultValue.min && max === defaultValue.max;

    debouncedOnChange(isDefault ? undefined : { min, max });
  }

  // TODO extract and test
  function getTickLabelIndices(total: number): number[] {
    if (tickLabelsCount >= total) {
      return Array.from({ length: total }, (_, i) => i);
    }

    return Array.from({ length: tickLabelsCount }, (_, i) => {
      return Math.round((i * (total - 1)) / (tickLabelsCount - 1));
    });
  }

  /*
    TODO:
    - extract typings
    - extract slide wrapper component
  */
</script>

<div class="slider-container">
  <p>{formatLabel({ min: value[0], max: value[1] })}</p>
  <Slider.Root
    {step}
    min={range.min}
    max={range.max}
    type="multiple"
    bind:value={getValue, setValue}
    class="slider-root"
    thumbPositioning="contain"
  >
    {#snippet children({ tickItems, thumbItems })}
      <span class="slider-track">
        <Slider.Range class="slider-range" />
      </span>
      {#each thumbItems as { index } (index)}
        <Slider.Thumb {index} class="slider-thumb">
          <SliderThumbIcon />
        </Slider.Thumb>
      {/each}
      {#each tickItems.filter( (_, i) => getTickLabelIndices(tickItems.length).includes(i), ) as { value, index } (index)}
        <Slider.TickLabel {index} position="bottom" class="tick-label">
          {value}
        </Slider.TickLabel>
      {/each}
    {/snippet}
  </Slider.Root>
</div>

<style>
  .slider-container {
    width: 100%;
    height: var(--ni-80);

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  :global(.slider-root) {
    position: relative;

    display: flex;
    width: 100%;

    align-items: center;
    user-select: none;
  }

  .slider-track {
    position: relative;

    height: var(--ni-20);
    width: 100%;

    flex-grow: 1;
    cursor: pointer;
    overflow: hidden;

    border-radius: var(--border-radius-xl);
    background-color: var(--shade-100);

    :global(.slider-range) {
      position: absolute;
      height: 100%;
      background-color: var(--blue-500);
    }
  }

  :global(.slider-thumb) {
    z-index: var(--layer-raised);
    display: flex;
    justify-content: center;
    align-items: center;

    width: var(--ni-32);
    height: var(--ni-32);

    cursor: pointer;
    border-radius: 50%;

    background-color: var(--blue-500);
    box-shadow:
      0px 1px 2px 0px #13151714,
      0px 4px 4px 0px #13151712,
      0px 9px 5px 0px #1315170a,
      0px 15px 6px 0px #13151703,
      0px 24px 7px 0px #13151700;

    transition: background-color var(--transition-increment) ease-in-out;

    &:hover {
      background-color: var(--blue-600);
    }

    &:focus-visible {
      outline: none;
    }
  }

  :global(.tick-label) {
    margin-top: var(--gap-s);
  }
</style>
