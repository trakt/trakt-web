<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { page } from "$app/state";
  import type { SearchItem } from "$lib/features/search/models/SearchItem";
  import SearchModePanel from "$lib/features/search/SearchModePanel.svelte";
  import SearchPlaceHolder from "$lib/features/search/SearchPlaceHolder.svelte";
  import SearchResultsGrid from "$lib/features/search/SearchResultsGrid.svelte";
  import { useSearch } from "$lib/features/search/useSearch";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { isMobileAppleDevice } from "$lib/utils/devices/isMobileAppleDevice";

  const query = $derived(page.url.searchParams.get("q")?.trim());

  const { search, clear, results, mode, postRecentSearch, coverSrc } =
    useSearch();

  $effect(() => {
    if (!query) {
      clear();
      return;
    }

    search(query, $mode);
  });

  const pageTitle = $derived(
    query ? m.page_title_search_results({ query }) : m.page_title_search(),
  );

  // FIXME: deal with ios onscreen keyboard and move to mobile navbar
  const isMobileApple = isMobileAppleDevice();

  const onResultClick = (item: SearchItem) => {
    if (!query) {
      return;
    }

    postRecentSearch(item, query);
  };
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={pageTitle}
>
  <RenderFor audience="authenticated" device={["tablet-lg", "desktop"]}>
    <!-- On large screens both the search toggle AND the search field live in
         the persistent NavbarContentToggle panel; keep mode="full" so the
         actions bar stays visible. -->
    <NavbarStateSetter mode="full" />
  </RenderFor>

  <RenderFor audience="authenticated" device={["tablet-sm", "mobile"]}>
    {#if isMobileApple}
      <!-- iOS keeps the panel in page flow so the on-screen keyboard never
           covers a bottom-anchored input. -->
      <div class="trakt-search-container">
        <SearchModePanel />
      </div>

      <NavbarStateSetter mode="full" />
    {:else}
      <NavbarStateSetter mode="minimal">
        {#snippet contextualActions()}
          <SearchModePanel />
        {/snippet}
      </NavbarStateSetter>
    {/if}
  </RenderFor>

  <TraktPageCoverSetter src={$coverSrc} />

  <div class="trakt-search-results-container">
    {#if $results}
      <SearchResultsGrid
        items={$results.items}
        type={$results.type}
        onclick={onResultClick}
      />
    {:else if !query}
      <SearchPlaceHolder />
    {/if}
  </div>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-search-results-container {
    // On large screens the search field lives in the fixed navbar panel, which
    // overhangs the actions bar (~40px extension + 20px shift) instead of
    // occupying page flow like the old standalone field did - clear it so the
    // results grid doesn't start underneath.
    @include for-tablet-lg {
      padding-top: calc(var(--ni-40) + var(--ni-4) + var(--gap-m));
    }

    @include for-desktop {
      padding-top: calc(var(--ni-40) + var(--ni-4) + var(--gap-m));
    }
  }

  .trakt-search-container {
    display: flex;
    flex-direction: column;

    flex-wrap: wrap;
    justify-content: center;
    align-content: center;

    gap: var(--gap-s);
    padding: 0 var(--layout-distance-side);

    :global(.trakt-search-icon) {
      z-index: calc(var(--layer-overlay) - 1);
    }

    @include for-tablet-sm-and-below {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
</style>
