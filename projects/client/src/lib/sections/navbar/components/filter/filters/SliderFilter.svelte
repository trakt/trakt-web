<script lang="ts">
  import type { SliderRange } from "$lib/components/slider/models/SliderRange";
  import { isFullRange } from "$lib/components/slider/isFullRange";
  import type { FilterKey } from "$lib/features/filters/models/Filter";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import type {
    AdditionalKey,
    SliderOption,
  } from "$lib/features/filters/models/FilterOptions";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { useFilterSetter } from "./_internal/useFilterSetter";
  import SliderField from "./SliderField.svelte";

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

  const onCommitHandler = (newValue: SliderRange) => {
    const isDefaultValue = isFullRange({
      value: newValue,
      range: sliderOptions.range,
    });

    gotoFilteredState({
      key,
      range: isDefaultValue ? null : newValue,
      mode,
      additionalKeys,
    });
  };
</script>

<SliderField
  label={sliderOptions.label?.()}
  range={sliderOptions.range}
  {value}
  ticks={sliderOptions.ticks}
  formatLabel={sliderOptions.formatLabel}
  {disabled}
  onCommit={onCommitHandler}
/>
