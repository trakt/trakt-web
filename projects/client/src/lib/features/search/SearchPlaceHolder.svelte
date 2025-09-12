<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import LoadingIndicator from "$lib/sections/lists/drilldown/_internal/LoadingIndicator.svelte";
  import { useTrendingSearchesList } from "./_internal/useTrendingSearchesList.ts";
  import SearchResultsGrid from "./SearchResultsGrid.svelte";
  import { useSearch } from "./useSearch";

  const { mode } = useSearch();
  const { list, isLoading } = $derived(useTrendingSearchesList($mode));

  const title = $derived.by(() => {
    switch ($mode) {
      case "media":
        return m.list_title_most_searched_media();
      case "movie":
        return m.list_title_most_searched_movies();
      case "show":
        return m.list_title_most_searched_shows();
      case "people":
        return m.list_title_birthdays_this_month();
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
