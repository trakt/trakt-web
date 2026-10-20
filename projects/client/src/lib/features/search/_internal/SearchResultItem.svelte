<script lang="ts">
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import type { MediaInputDefault } from "$lib/models/MediaInput";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import DefaultPersonItem from "$lib/sections/lists/components/DefaultPersonItem.svelte";
  import ListSummaryItem from "$lib/sections/lists/components/list-summary/ListSummaryItem.svelte";
  import type { SearchItem } from "../models/SearchItem";
  import type { SearchResultPosition } from "../models/SearchResultPosition";
  import { useSearch } from "../useSearch";

  const {
    item,
    onclick,
    source,
    position,
  }: {
    item: SearchItem;
    onclick?: (item: SearchItem) => void;
    source: string;
    position?: SearchResultPosition;
  } = $props();

  const { mode } = useSearch();

  const isMedia = (item: SearchItem): item is MediaEntry => {
    return "type" in item && (item.type === "movie" || item.type === "show");
  };

  const isPerson = (item: SearchItem): item is PersonSummary => {
    return "biography" in item;
  };
</script>

{#snippet mediaTag(item: MediaInputDefault)}
  <AirDateTag i18n={TagIntlProvider} airDate={item.airDate} year={item.year} />

  {#if $mode === "movie"}
    <DurationTag i18n={TagIntlProvider} runtime={item.runtime} />
  {/if}

  {#if $mode === "show" && "episode" in item}
    <EpisodeCountTag i18n={TagIntlProvider} count={item.episode.count} />
  {/if}
{/snippet}

{#if isMedia(item)}
  {#snippet mediaResultTag()}
    {@render mediaTag(item)}
  {/snippet}

  <DefaultMediaItem
    type={item.type}
    media={item}
    style="cover"
    {source}
    {position}
    tag={mediaResultTag}
    mode={$mode === "media" ? "mixed" : "standalone"}
    {onclick}
  />
{:else if isPerson(item)}
  <DefaultPersonItem
    person={item}
    {source}
    {position}
    variant="birthday"
    {onclick}
  />
{:else}
  <trakt-search-result-list>
    <ListSummaryItem list={item} {source} {position} {onclick} />
  </trakt-search-result-list>
{/if}

<style>
  /* FIXME:
    Temporarily disallow list likes in search results until
    list search queries can be invalidated
  */
  trakt-search-result-list {
    :global(trakt-list-like-action .trakt-button) {
      pointer-events: none;
      opacity: 0.75;
    }
  }
</style>
