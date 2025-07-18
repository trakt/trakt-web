<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { page } from "$app/state";
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import InfoTag from "$lib/components/media/tags/InfoTag.svelte";
  import SearchInput from "$lib/features/search/SearchInput.svelte";
  import { useSearch } from "$lib/features/search/useSearch";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import { mediaListHeightResolver } from "$lib/sections/lists/utils/mediaListHeightResolver";
  import { NAVBAR_CONFIG } from "$lib/sections/navbar/constants";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";

  const query = $derived(page.url.searchParams.get("q")?.trim());

  const {
    search: searchMovies,
    clear: clearMovies,
    results: movies,
  } = useSearch("movie");

  const {
    search: searchShows,
    clear: clearShows,
    results: shows,
  } = useSearch("show");

  $effect(() => {
    if (!query) {
      clearMovies();
      clearShows();
      return;
    }

    searchMovies(query);
    searchShows(query);
  });

  const first = $derived($shows.at(0) ?? $movies.at(0));
  const pageTitle = $derived(
    query ? m.page_title_search_results({ query }) : m.page_title_search(),
  );
</script>

<TraktPage audience="all" image={DEFAULT_SHARE_COVER} title={pageTitle}>
  <RenderFor audience="all" device={NAVBAR_CONFIG.side.device}>
    <div class="trakt-search-container">
      <SearchInput isInline={false} />
    </div>
  </RenderFor>

  {#if first}
    <CoverImageSetter src={first.cover.url.medium} type={first.type} />
  {:else}
    <TraktPageCoverSetter />
  {/if}

  {#if query}
    <SectionList
      id="search-grid-list-movies"
      title={m.text_search_results_for({
        query: m.translated_value_type_movie(),
      })}
      items={$movies}
      --height-list={mediaListHeightResolver("portrait")}
    >
      {#snippet item(result)}
        <DefaultMediaItem type={result.type} media={result} style="cover" />
      {/snippet}
    </SectionList>

    <SectionList
      id="search-grid-list-shows"
      title={m.text_search_results_for({
        query: m.translated_value_type_show(),
      })}
      items={$shows}
      --height-list={mediaListHeightResolver("portrait")}
    >
      {#snippet item(result)}
        <DefaultMediaItem type={result.type} media={result} style="cover">
          {#snippet tag()}
            <InfoTag>
              {toTranslatedValue("type", result.type)}
            </InfoTag>
          {/snippet}
        </DefaultMediaItem>
      {/snippet}
    </SectionList>
  {/if}
</TraktPage>

<style>
  .trakt-search-container {
    margin-left: var(--layout-distance-side);

    :global(.trakt-search-icon) {
      z-index: calc(var(--layer-overlay) - 1);
    }
  }
</style>
