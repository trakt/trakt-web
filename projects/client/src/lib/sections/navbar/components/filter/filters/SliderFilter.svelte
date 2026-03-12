<script lang="ts">
  import type { SliderRange } from "$lib/components/slider/models/SliderRange";
  import Slider from "$lib/components/slider/Slider.svelte";
  import type { FilterKey } from "$lib/features/filters/models/Filter";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import type {
    AdditionalKey,
    SliderOption,
  } from "$lib/features/filters/models/FilterOptions";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { useFilterSetter } from "./_internal/useFilterSetter";

  const {
    key,
    sliderOptions,
    mode,
    additionalKeys = [],
    disabled = false,
  }: {
    key: FilterKey;
    sliderOptions: SliderOption;
    mode: FilterMode;
    additionalKeys?: AdditionalKey[];
    disabled?: boolean;
  } = $props();

  const { getFilterValue } = useFilter();
  const currentValueRaw = $derived(getFilterValue(key));

  const value = $derived.by(() => {
    if ($currentValueRaw) {
      const [min, max] = $currentValueRaw.split("-");
      return { min: Number(min), max: Number(max) };
    }

    return sliderOptions.range;
  });

  const { gotoFilteredState } = useFilterSetter();

  let previewValue = $state<SliderRange | null>(null);
  const labelValue = $derived(
    previewValue ?? { min: value.min, max: value.max },
  );

  const onChangeHandler = (newValue: SliderRange) => {
    previewValue = newValue;
  };

  const onCommitHandler = (newValue: SliderRange) => {
    previewValue = null;

    const isDefaultValue =
      newValue.min === sliderOptions.range.min &&
      newValue.max === sliderOptions.range.max;

    gotoFilteredState({
      key,
      range: isDefaultValue ? null : newValue,
      mode,
      additionalKeys,
    });
  };
</script>

<div class="slider-container">
  <p>{sliderOptions.formatLabel(labelValue)}</p>
  <Slider
    range={sliderOptions.range}
    {value}
    ticks={sliderOptions.ticks}
    onChange={onChangeHandler}
    onCommit={onCommitHandler}
    {disabled}
  />
</div>

<style>
  .slider-container {
    width: 100%;
    height: var(--ni-64);

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }
</style>
