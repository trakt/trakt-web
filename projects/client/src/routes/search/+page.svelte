<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { page } from "$app/state";
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import InfoTag from "$lib/components/media/tags/InfoTag.svelte";
  import SearchInput from "$lib/features/search/SearchInput.svelte";
  import SearchModeToggles from "$lib/features/search/SearchModeToggles.svelte";
  import SearchTypeToggles from "$lib/features/search/SearchTypeToggles.svelte";
  import { useSearch } from "$lib/features/search/useSearch";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import DefaultPersonItem from "$lib/sections/lists/components/DefaultPersonItem.svelte";
  import { NAVBAR_CONFIG } from "$lib/sections/navbar/constants";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";

  const query = $derived(page.url.searchParams.get("q")?.trim());

  const { search, clear, results, mode, mediaType } = useSearch();

  $effect(() => {
    if (!query) {
      clear();
      return;
    }

    search(query, $mode, $mediaType);
  });

  const src = $derived.by(() => {
    if (!$results) {
      return;
    }

    if ($results.type === "media") {
      const item = $results.items.at(0);
      return item?.cover?.url.medium;
    }

    return $results.items.at(0)?.headshot.url.medium;
  });

  const pageTitle = $derived(
    query ? m.page_title_search_results({ query }) : m.page_title_search(),
  );
</script>

{#snippet showTag()}
  <InfoTag>
    {toTranslatedValue("type", "show")}
  </InfoTag>
{/snippet}

<TraktPage audience="all" image={DEFAULT_SHARE_COVER} title={pageTitle}>
  <RenderFor audience="all" device={NAVBAR_CONFIG.side.device}>
    <div class="trakt-search-container">
      <SearchInput isInline={false} />
    </div>
  </RenderFor>

  {#if src}
    <CoverImageSetter {src} type="main" />
  {:else}
    <TraktPageCoverSetter />
  {/if}

  <SearchModeToggles />

  <div class="trakt-search-results-container">
    {#if $results}
      {#if $results.type === "media"}
        <GridList
          id="search-grid-list-media"
          title={m.list_title_search_results()}
          items={$results.items}
          --width-item="var(--width-portrait-card)"
        >
          {#snippet badge()}
            <SearchTypeToggles />
          {/snippet}

          {#snippet item(result)}
            <DefaultMediaItem
              type={result.type}
              media={result}
              style="cover"
              tag={result.type === "show" ? showTag : undefined}
            />
          {/snippet}
        </GridList>
      {/if}

      {#if $results.type === "people"}
        <GridList
          id="search-grid-list-media"
          title={m.list_title_search_results()}
          items={$results.items}
          --width-item="var(--width-portrait-card)"
        >
          {#snippet item(person)}
            <DefaultPersonItem {person} />
          {/snippet}
        </GridList>
      {/if}
    {/if}
  </div>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-search-container {
    margin-left: var(--layout-distance-side);

    :global(.trakt-search-icon) {
      z-index: calc(var(--layer-overlay) - 1);
    }
  }

  .trakt-search-results-container {
    @include for-mobile {
      :global(.trakt-list-items) {
        grid-template-columns: repeat(auto-fill, var(--width-item));
      }
    }
  }
</style>
