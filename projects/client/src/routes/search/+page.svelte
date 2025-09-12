<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { page } from "$app/state";
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import SearchInput from "$lib/features/search/SearchInput.svelte";
  import SearchModeToggles from "$lib/features/search/SearchModeToggles.svelte";
  import SearchPlaceHolder from "$lib/features/search/SearchPlaceHolder.svelte";
  import SearchResultsGrid from "$lib/features/search/SearchResultsGrid.svelte";
  import { useSearch } from "$lib/features/search/useSearch";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import { NAVBAR_CONFIG } from "$lib/sections/navbar/constants";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { isMobileAppleDevice } from "$lib/utils/devices/isMobileAppleDevice";

  const query = $derived(page.url.searchParams.get("q")?.trim());

  const { search, clear, results, mode } = useSearch();

  $effect(() => {
    if (!query) {
      clear();
      return;
    }

    search(query, $mode);
  });

  const src = $derived.by(() => {
    if (!$results) {
      return;
    }

    if ($results.type !== "people") {
      const item = $results.items.at(0);
      return item?.cover?.url.medium;
    }

    return $results.items.at(0)?.headshot.url.medium;
  });

  const pageTitle = $derived(
    query ? m.page_title_search_results({ query }) : m.page_title_search(),
  );

  // FIXME: deal with ios onscreen keyboard and move to mobile navbar
  const showOnPageSearch = isMobileAppleDevice();
</script>

{#snippet searchControls()}
  <div class="trakt-search-container">
    <SearchInput />
    <SearchModeToggles />
  </div>
{/snippet}

<TraktPage audience="all" image={DEFAULT_SHARE_COVER} title={pageTitle}>
  <RenderFor audience="all" device={NAVBAR_CONFIG.side.device}>
    {@render searchControls()}
  </RenderFor>

  {#if showOnPageSearch}
    {@render searchControls()}
  {/if}

  {#if src}
    <CoverImageSetter {src} type="main" />
  {:else}
    <TraktPageCoverSetter />
  {/if}

  <div class="trakt-search-results-container">
    {#if $results}
      <SearchResultsGrid items={$results.items} />
    {:else if !query}
      <SearchPlaceHolder />
    {/if}
  </div>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-search-container {
    display: flex;
    flex-direction: column;
    padding: var(--ni-0) var(--layout-distance-side);

    flex-wrap: wrap;
    justify-content: center;
    align-content: center;

    gap: var(--gap-s);

    padding-top: var(--ni-88);
    padding-bottom: var(--ni-24);

    :global(.trakt-search-icon) {
      z-index: calc(var(--layer-overlay) - 1);
    }

    @include for-tablet-sm-and-below {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
</style>
