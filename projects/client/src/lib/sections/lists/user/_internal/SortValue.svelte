<script lang="ts">
  import type { ListItem } from "$lib/requests/models/ListItem";
  import type { SortBy } from "../models/SortBy";
  import { formatSortValue } from "./formatSortValue";
  import SortIcon from "./SortIcon.svelte";

  const { item, sortBy }: { item: ListItem; sortBy?: SortBy } = $props();

  const valueText = $derived(formatSortValue(item, sortBy));
</script>

<div class="trakt-sort-value">
  {#if valueText && sortBy}
    <SortIcon {sortBy} />
  {/if}

  <p class="tag secondary bold ellipsis">
    {valueText}
  </p>
</div>

<style>
  .trakt-sort-value {
    display: flex;
    align-items: center;
    gap: var(--gap-micro);

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }
  }
</style>
