<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { page } from "$app/state";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import InfoTag from "$lib/components/media/tags/InfoTag.svelte";
  import { useSearch } from "$lib/features/search/useSearch";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";

  const query = $derived(page.url.searchParams.get("q")?.trim());

  const { search, clear, isSearching, results } = useSearch();

  $effect(() => {
    if (!query) {
      clear();
      return;
    }

    search(query);
  });

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

{#if query}
  <GridList
    id="search-grid-list"
    title={m.results_for_title({ query })}
    items={$results}
    --width-item="var(--width-portrait-card)"
  >
    {#snippet item(result)}
      <DefaultMediaItem type={result.type} media={result} {style}>
        {#snippet tag()}
          <InfoTag>
            {toTranslatedValue("type", result.type)}
          </InfoTag>
        {/snippet}
      </DefaultMediaItem>
    {/snippet}
  </GridList>
{/if}
