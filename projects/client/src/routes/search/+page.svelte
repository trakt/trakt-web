<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { page } from "$app/state";
  import SearchInput from "$lib/features/search/SearchInput.svelte";
  import SearchModeToggles from "$lib/features/search/SearchModeToggles.svelte";
  import SearchPlaceHolder from "$lib/features/search/SearchPlaceHolder.svelte";
  import SearchResultsGrid from "$lib/features/search/SearchResultsGrid.svelte";
  import { useSearch } from "$lib/features/search/useSearch";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { isMobileAppleDevice } from "$lib/utils/devices/isMobileAppleDevice";

  const query = $derived(page.url.searchParams.get("q")?.trim());

  const { search, clear, results, mode, postRecentSearch } = useSearch();

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
  const isMobileApple = isMobileAppleDevice();

  const onResultClick = (item: PersonSummary | MediaEntry) => {
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
    <div class="trakt-search-container">
      <SearchInput />
      <SearchModeToggles />
    </div>
  </RenderFor>

  <RenderFor audience="authenticated" device={["tablet-sm", "mobile"]}>
    {#if isMobileApple}
      <div class="trakt-search-container">
        <SearchInput />
      </div>

      <NavbarStateSetter>
        {#snippet actions()}
          <SearchModeToggles />
        {/snippet}
      </NavbarStateSetter>
    {:else}
      <NavbarStateSetter mode="minimal">
        {#snippet contextualActions()}
          <SearchModeToggles />
          <SearchInput />
        {/snippet}
      </NavbarStateSetter>
    {/if}
  </RenderFor>

  <TraktPageCoverSetter {src} />

  <div class="trakt-search-results-container">
    {#if $results}
      <SearchResultsGrid items={$results.items} onclick={onResultClick} />
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
