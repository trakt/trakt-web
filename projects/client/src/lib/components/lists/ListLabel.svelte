<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import type { ListLabelProps } from "./ListLabelProps.ts";

  const { title, subtitle, count }: ListLabelProps = $props();
</script>

<span class="trakt-list-label">
  <span class="label-text small uppercase ellipsis">
    {title}{#if subtitle}<span class="label-subtitle">{` / ${subtitle}`}</span
      >{/if}
  </span>
  {#if count}
    <span class="label-count small secondary">
      {toHumanNumber(count, languageTag())}
    </span>
  {/if}
</span>

<style>
  .trakt-list-label {
    display: inline-flex;
    align-items: baseline;
    gap: calc((var(--gap-xs) + var(--gap-micro)) * 0.5);
    min-width: 0;

    .label-text,
    .label-count {
      font-weight: 700;
      letter-spacing: 0.12em;
      line-height: var(--ni-16);
    }

    .label-text {
      color: var(--color-text-primary);
    }

    .label-count {
      flex-shrink: 0;
      font-variant-numeric: tabular-nums;
    }

    .label-subtitle {
      font-size: inherit;
      color: var(--color-text-primary);
    }
  }
</style>
