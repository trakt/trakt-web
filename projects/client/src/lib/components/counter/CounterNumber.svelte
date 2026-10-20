<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import { toGroupedNumber } from "$lib/utils/formatting/number/toGroupedNumber.ts";
  import type { CounterNumberProps } from "./_internal/CounterNumberProps.ts";

  const { value, accessibleLabel }: CounterNumberProps = $props();

  const text = $derived(toGroupedNumber(value, getLocale()));
</script>

<span class="trakt-counter-number">
  <span class="counter-label">{accessibleLabel}</span>
  <span aria-hidden="true">{text}</span>
</span>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-counter-number,
  .trakt-counter-number span {
    font-size: inherit;
    font-weight: inherit;
  }

  .trakt-counter-number {
    display: inline-flex;
    justify-content: center;
    direction: ltr;

    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
  }

  .counter-label {
    @include visually-hidden;
  }
</style>
