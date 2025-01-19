<script lang="ts">
  import MoreButton from "$lib/components/buttons/more/MoreButton.svelte";
  import { MoreButtonIntlProvider } from "$lib/components/buttons/more/MoreButtonIntlProvider";
  import * as m from "$lib/features/i18n/messages.ts";
  import { writable } from "svelte/store";

  const SEPARATOR = ", ";
  const MAX_ITEMS = 2;

  type MediaCollapsableValuesProps = {
    category: string;
    values: string[];
  };

  const { category, values }: MediaCollapsableValuesProps = $props();

  const displayableValues = values.slice(0, MAX_ITEMS).join(SEPARATOR);
  const omittedValues = values.slice(MAX_ITEMS).join(SEPARATOR);
  const omittedValueCount = values.length - MAX_ITEMS;

  const expanded = writable(false);
</script>

<div class="trakt-summary-detail-values">
  <p class="small capitalize">{displayableValues}</p>
  {#if omittedValueCount > 0}
    <MoreButton
      i18n={MoreButtonIntlProvider}
      label="{m.expand_category({ category })}}"
      count={omittedValueCount}
      onExpand={() => expanded.set(true)}
      onCollapse={() => expanded.set(false)}
    />
    <div class="media-collapsable-detail-contents" hidden={!$expanded}>
      <p class="small capitalize">{omittedValues}</p>
    </div>
  {/if}
</div>

<style>
  .trakt-summary-detail-values {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    min-height: var(--ni-24);
  }

  .media-collapsable-detail-contents {
    grid-column: span 2;
  }
</style>
