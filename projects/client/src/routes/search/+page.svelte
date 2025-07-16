<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { page } from "$app/state";
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import InfoTag from "$lib/components/media/tags/InfoTag.svelte";
  import SearchInput from "$lib/features/search/SearchInput.svelte";
  import { useSearch } from "$lib/features/search/useSearch";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import { mediaListHeightResolver } from "$lib/sections/lists/utils/mediaListHeightResolver";
  import { useNavbarType } from "$lib/sections/navbar/useNavbarType";
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
  const { navbarType } = useNavbarType();
</script>

{#if $navbarType === "side"}
  <div class="trakt-search">
    <SearchInput />
  </div>
{/if}

{#if query}
  <TraktPage
    audience="all"
    image={DEFAULT_SHARE_COVER}
    title={m.page_title_search_results({ query })}
  >
    {#if first}
      <CoverImageSetter src={first.cover.url.medium} type={first.type} />
    {:else}
      <TraktPageCoverSetter />
    {/if}

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
  </TraktPage>
{/if}

<style>
  .trakt-search {
    margin: var(--gap-xl) var(--layout-distance-side);

    :global(.trakt-search-icon) {
      z-index: calc(var(--layer-overlay) - 1);
    }
  }
</style>
