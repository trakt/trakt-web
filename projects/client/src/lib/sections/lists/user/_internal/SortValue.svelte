<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { FavoritedEntry } from "$lib/requests/models/FavoritedEntry";
  import type { ListItem } from "$lib/requests/models/ListItem";
  import type { SortBy } from "../models/SortBy";
  import { formatSortValue } from "./formatSortValue";
  import { getUserRatingForItem } from "./getUserRatingForItem";
  import SortIcon from "../SortIcon.svelte";

  const { item, sortBy }: { item: ListItem | FavoritedEntry; sortBy?: SortBy } =
    $props();

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
