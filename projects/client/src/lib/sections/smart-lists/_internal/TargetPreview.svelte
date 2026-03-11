<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import AnticipatedPaginatedList from "$lib/sections/lists/anticipated/AnticipatedPaginatedList.svelte";
  import PopularPaginatedList from "$lib/sections/lists/popular/PopularPaginatedList.svelte";
  import TrendingPaginatedList from "$lib/sections/lists/trending/TrendingPaginatedList.svelte";
  import type { ListTarget } from "../models/ListTarget";

  const { target, type }: { target: ListTarget; type: MediaType } = $props();
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
    title={type === "movie"
      ? m.list_title_trending_movies()
      : m.list_title_trending_shows()}
    {type}
    {actions}
  />
{/if}

{#if target === "anticipated"}
  <AnticipatedPaginatedList
    title={type === "movie"
      ? m.list_title_anticipated_movies()
      : m.list_title_anticipated_shows()}
    {type}
    {actions}
  />
{/if}

{#if target === "popular"}
  <PopularPaginatedList
    title={type === "movie"
      ? m.list_title_popular_movies()
      : m.list_title_popular_shows()}
    {type}
    {actions}
  />
{/if}

<style>
  .preview-tag {
    color: var(--shade-10);
  }
</style>
