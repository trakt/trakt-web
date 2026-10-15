<script lang="ts">
  import { isFullRange } from "$lib/components/slider/isFullRange";
  import type { SliderRange } from "$lib/components/slider/models/SliderRange";
  import Slider from "$lib/components/slider/Slider.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SliderFieldProps } from "./SliderFieldProps.ts";

  const {
    label,
    range,
    value,
    step,
    ticks,
    formatLabel,
    disabled = false,
    onCommit,
  }: SliderFieldProps = $props();

  let labelValue = $derived<SliderRange>({ min: value.min, max: value.max });

  const isDefault = $derived(isFullRange({ value: labelValue, range }));

  const formatValue = $derived(ticks?.formatter ?? String);

  const valueText = $derived(
    isDefault ? m.option_text_all() : m.list_summary_range_between({
      min: formatValue(labelValue.min),
      max: formatValue(labelValue.max),
    }),
  );
</script>

<div class="trakt-slider-field">
  <div class="slider-field-head" aria-hidden={formatLabel != null}>
    {#if label}
      <span class="secondary ellipsis">{label}</span>
    {/if}
    <span class="slider-field-value" class:is-active={!isDefault}
      >{valueText}</span
    >
  </div>
  {#if formatLabel}
    <span class="slider-field-description">{formatLabel(labelValue)}</span>
  {/if}
  <Slider
    {range}
    {value}
    {step}
    {ticks}
    onChange={(next) => (labelValue = next)}
    {onCommit}
    {disabled}
  />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-slider-field {
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 0;

    box-sizing: border-box;
    padding-block: 0 calc(var(--gap-xs) + var(--ni-16));
    padding-inline: var(--gap-xxs);

    .slider-field-description {
      @include visually-hidden;
    }

    .slider-field-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-s);

      min-height: var(--ni-32);
    }

    .slider-field-value {
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
