<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import AnticipatedPaginatedList from "$lib/sections/lists/anticipated/AnticipatedPaginatedList.svelte";
  import LibraryListPaginated from "$lib/sections/lists/library/LibraryListPaginated.svelte";
  import PopularPaginatedList from "$lib/sections/lists/popular/PopularPaginatedList.svelte";
  import RecommendedPaginatedList from "$lib/sections/lists/recommended/RecommendedPaginatedList.svelte";
  import TrendingPaginatedList from "$lib/sections/lists/trending/TrendingPaginatedList.svelte";
  import WatchlistPaginatedList from "$lib/sections/lists/watchlist/WatchlistPaginatedList.svelte";
  import type { ListTarget } from "../models/ListTarget";

  const { target, type }: { target: ListTarget; type: DiscoverMode } = $props();

  const titles = $derived({
    trending: {
      movie: m.list_title_trending_movies(),
      show: m.list_title_trending_shows(),
      media: m.list_title_trending(),
    },
    anticipated: {
      movie: m.list_title_anticipated_movies(),
      show: m.list_title_anticipated_shows(),
      media: m.list_title_most_anticipated(),
    },
    popular: {
      movie: m.list_title_popular_movies(),
      show: m.list_title_popular_shows(),
      media: m.list_title_most_popular(),
    },
    recommendations: {
      movie: m.list_title_recommended_movies(),
      show: m.list_title_recommended_shows(),
      media: m.list_title_recommended(),
    },
    watchlist: {
      movie: m.list_title_watchlist_movies(),
      show: m.list_title_watchlist_shows(),
      media: m.list_title_watchlist(),
    },
    library: {
      movie: m.list_title_library(),
      show: m.list_title_library(),
      media: m.list_title_library(),
    },
  });
</script>

{#snippet actions()}
  <StemTag>
    <span class="tag secondary preview-tag"
      >{m.tag_text_smart_list_preview()}</span
    >
  </StemTag>
{/snippet}

{#if target === "trending"}
  <TrendingPaginatedList
    title={titles.trending[type]}
    {type}
    {actions}
  />
{:else if target === "anticipated"}
  <AnticipatedPaginatedList
    title={titles.anticipated[type]}
    {type}
    {actions}
  />
{:else if target === "popular"}
  <PopularPaginatedList
    title={titles.popular[type]}
    {type}
    {actions}
  />
{:else if target === "recommendations"}
  <RecommendedPaginatedList
    title={titles.recommendations[type]}
    {type}
    {actions}
  />
{:else if target === "watchlist"}
  <WatchlistPaginatedList
    title={titles.watchlist[type]}
    {type}
    sortBy={undefined}
    sortHow="desc"
    {actions}
  />
{:else if target === "library"}
  <LibraryListPaginated
    library="plex"
    title={titles.library[type]}
    {type}
    {actions}
  />
{/if}

<style>
  .preview-tag {
    color: var(--shade-10);
  }
</style>
