<script lang="ts">
  import type { SliderRange } from "$lib/components/slider/models/SliderRange";
  import { isFullRange } from "$lib/components/slider/isFullRange";
  import Slider from "$lib/components/slider/Slider.svelte";
  import type { FilterKey } from "$lib/features/filters/models/Filter";
  import { FilterMode } from "$lib/features/filters/models/FilterMode";
  import * as m from "$lib/features/i18n/messages.ts";
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

  let labelValue = $derived<SliderRange>({ min: value.min, max: value.max });

  const isDefault = $derived(
    isFullRange({ value: labelValue, range: sliderOptions.range }),
  );

  const formatValue = $derived(sliderOptions.ticks?.formatter ?? String);

  const valueText = $derived(
    isDefault ? m.option_text_all() : m.list_summary_range_between({
      min: formatValue(labelValue.min),
      max: formatValue(labelValue.max),
    }),
  );

  const onChangeHandler = (newValue: SliderRange) => {
    labelValue = newValue;
  };

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

<div class="trakt-slider-filter">
  <div class="slider-filter-head" aria-hidden="true">
    {#if sliderOptions.label}
      <span class="secondary ellipsis">{sliderOptions.label()}</span>
    {/if}
    <span class="slider-filter-value" class:is-active={!isDefault}
      >{valueText}</span
    >
  </div>
  <span class="slider-filter-description"
    >{sliderOptions.formatLabel(labelValue)}</span
  >
  <Slider
    range={sliderOptions.range}
    {value}
    ticks={sliderOptions.ticks}
    onChange={onChangeHandler}
    onCommit={onCommitHandler}
    {disabled}
  />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-slider-filter {
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 0;

    box-sizing: border-box;
    padding-block: 0 calc(var(--gap-xs) + var(--ni-16));
    padding-inline: var(--gap-xxs);

    .slider-filter-description {
      @include visually-hidden;
    }

    .slider-filter-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-s);

      min-height: var(--ni-32);
    }

    .slider-filter-value {
      flex-shrink: 0;

      color: var(--color-text-secondary);
      font-variant-numeric: tabular-nums;

      transition: color var(--transition-increment) ease-in-out;

      &.is-active {
        color: var(--color-text-primary);
      }
    }
  }
</style>
