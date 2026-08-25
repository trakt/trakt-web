<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import { drilldownGrid } from "$lib/sections/lists/utils/drilldownGrid.ts";
  import { useLargeScreenCards } from "$lib/features/large-screen-cards/useLargeScreenCards.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import CreditMediaItem from "../components/CreditMediaItem.svelte";
  import NoFilterResultsPlaceholder from "../drilldown/_internal/NoFilterResultsPlaceholder.svelte";
  import { useHistoryCreditsList } from "./_internal/useHistoryCreditsList";

  type CreditsHistoryPaginatedListProps = {
    slug: string;
    name: string;
  };

  const { slug, name }: CreditsHistoryPaginatedListProps = $props();

  const { filterMap, isFiltered } = useFilter();
  const { mode } = useDiscover();

  const { list, isLoading } = useHistoryCreditsList({
    slug$: fromRune(() => slug),
    filter$: filterMap,
    mode$: mode,
  });

  const isLargeScreenCards = useLargeScreenCards();
  const grid = $derived(drilldownGrid($isLargeScreenCards));
</script>

<GridList
  id={`credits-history-list-${slug}`}
  items={$list}
  sizing={grid.sizing}
  --width-item={grid.itemWidth}
>
  {#snippet item(entry)}
    <CreditMediaItem
      mediaCredit={entry}
      source="credits-history"
      mode="mixed"
      style="summary"
    />
  {/snippet}

  {#snippet empty()}
    {#if $isFiltered && !$isLoading}
      <NoFilterResultsPlaceholder />
    {:else if $isLoading}
      <LoadingIndicator />
    {:else}
      <p class="secondary">
        {m.list_placeholder_from_my_history({ name })}
      </p>
    {/if}
  {/snippet}
</GridList>
