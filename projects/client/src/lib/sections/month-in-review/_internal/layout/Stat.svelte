<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import CountUp from "../parts/CountUp.svelte";

  const {
    value,
    label,
    note,
    trend,
  }: {
    value: string | number;
    label: string;
    note?: string;
    trend?: "up" | "down";
  } = $props();
</script>

<div class="trakt-month-review-stat">
  <span class="value">
    {#if typeof value === "number"}
      <CountUp {value} format={(shown) => toHumanNumber(shown, getLocale())} />
    {:else}
      {value}
    {/if}
  </span>
  <span class="label bold">{label}</span>
  {#if note}
    <span class="note bold" data-trend={trend}>{note}</span>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-review-stat {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .value {
    font-size: var(--ni-36);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
    font-variant-numeric: tabular-nums;

    @include for-mobile {
      font-size: var(--ni-28);
    }
  }

  .label {
    font-size: var(--font-size-text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .note {
    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
    font-variant-numeric: tabular-nums;

    &[data-trend="up"] {
      color: var(--green-500);
    }

    &[data-trend="down"] {
      color: var(--red-500);
    }
  }
</style>
