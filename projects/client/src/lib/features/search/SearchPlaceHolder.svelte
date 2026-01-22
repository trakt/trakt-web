<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useTrendingSearchesList } from "./_internal/useTrendingSearchesList.ts";
  import SearchResultsGrid from "./SearchResultsGrid.svelte";
  import { useSearch } from "./useSearch.ts";

  const { mode } = useSearch();
  const { list, isLoading } = $derived(useTrendingSearchesList($mode));

  const title = $derived.by(() => {
    switch ($mode) {
      case "people":
        return m.list_title_birthdays_this_month();
      default:
        return m.list_title_most_popular_searches();
    }
  });
</script>

<SearchResultsGrid {title} items={$list}>
  {#snippet empty()}
    {#if isLoading}
      <LoadingIndicator />
    {/if}
  {/snippet}
</SearchResultsGrid>
