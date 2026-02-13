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
      case "lists":
        return m.list_title_popular_lists();
      default:
        return m.list_title_most_popular_searches();
    }
  });

  const type = $derived.by(() => {
    if ($mode === "show" || $mode === "movie") {
      return "media";
    }

    return $mode;
  });
</script>

<SearchResultsGrid {title} items={$list} {type}>
  {#snippet empty()}
    {#if isLoading}
      <LoadingIndicator />
    {/if}
  {/snippet}
</SearchResultsGrid>
