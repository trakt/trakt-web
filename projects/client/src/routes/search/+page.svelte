<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { page } from "$app/state";
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import InfoTag from "$lib/components/media/tags/InfoTag.svelte";
  import SearchInput from "$lib/features/search/SearchInput.svelte";
  import SearchModeToggles from "$lib/features/search/SearchModeToggles.svelte";
  import { useSearch } from "$lib/features/search/useSearch";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import PersonList from "$lib/sections/lists/PersonList.svelte";
  import { mediaListHeightResolver } from "$lib/sections/lists/utils/mediaListHeightResolver";
  import { NAVBAR_CONFIG } from "$lib/sections/navbar/constants";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";

  const query = $derived(page.url.searchParams.get("q")?.trim());

  const { search, clear, results, mode } = useSearch();

  $effect(() => {
    if (!query) {
      clear();
      return;
    }

    search(query, $mode);
  });

  const coverSrc = $derived.by(() => {
    if (!$results) {
      return;
    }

    if ($results.type === "media") {
      const item = $results.items.movies.at(0) || $results.items.shows.at(0);
      return item?.cover?.url.medium;
    }

    return $results.items.at(0)?.headShotUrl;
  });

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

  {#if coverSrc}
    <CoverImageSetter src={coverSrc} type="main" />
  {:else}
    <TraktPageCoverSetter />
  {/if}

  <SearchModeToggles />

  {#if $results}
    {#if $results.type === "media"}
      <SectionList
        id="search-grid-list-movies"
        title={m.text_search_results_for({
          query: m.translated_value_type_movie(),
        })}
        items={$results.items.movies}
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
        items={$results.items.shows}
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

    {#if $results.type === "people"}
      <PersonList
        title={m.text_search_results_for({
          query: m.text_search_mode_people(),
        })}
        people={$results.items}
      />
    {/if}
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
