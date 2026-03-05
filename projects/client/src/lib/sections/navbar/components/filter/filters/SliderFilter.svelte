<script lang="ts">
  import type { SliderRange } from "$lib/components/slider/models/SliderRange";
  import Slider from "$lib/components/slider/Slider.svelte";
  import { type AdvancedSliderFilter } from "$lib/features/filters/models/Filter";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { useFilterSetter } from "./_internal/useFilterSetter";

  const {
    filter,
    disabled = false,
  }: { filter: AdvancedSliderFilter; disabled?: boolean } = $props();

  const config = $derived(filter.advanced);

  const { getFilterValue } = useFilter();
  const currentValueRaw = $derived(getFilterValue(filter.key));

  const value = $derived.by(() => {
    if ($currentValueRaw) {
      const [min, max] = $currentValueRaw.split("-");
      return { min: Number(min), max: Number(max) };
    }

    return config.range;
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
      newValue.min === config.range.min && newValue.max === config.range.max;

    gotoFilteredState({
      key: filter.key,
      value: isDefaultValue ? null : `${newValue.min}-${newValue.max}`,
      mode: FilterMode.Advanced,
    });
  };
</script>

<div class="slider-container">
  <p>{config.formatLabel(labelValue)}</p>
  <Slider
    range={config.range}
    {value}
    ticks={config.ticks}
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
