<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { SortBy } from "../models/SortBy";
  import SortIcon from "../SortIcon.svelte";
  import { formatSortValue, type SortInput } from "./formatSortValue";
  import { getUserRatingForItem } from "./getUserRatingForItem";

  const { item, sortBy }: { item: SortInput; sortBy?: SortBy } = $props();

  const { ratings } = useUser();
  const userRating = $derived(
    sortBy === "my_rating" ? getUserRatingForItem(item, $ratings) : undefined,
  );
  const valueText = $derived(formatSortValue(item, sortBy, userRating));
</script>

<div class="trakt-sort-value">
  {#if valueText && sortBy}
    <SortIcon {sortBy} variant="value" />
  {/if}

  <p class="bold ellipsis">
    {valueText}
  </p>
</div>

<style>
  .trakt-sort-value {
    display: flex;
    align-items: center;
    gap: var(--gap-micro);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
