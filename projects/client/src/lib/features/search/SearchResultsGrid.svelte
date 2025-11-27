<script lang="ts">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import MediaIconTag from "$lib/components/media/tags/MediaIconTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import { type MediaInputDefault } from "$lib/models/MediaInput";
  import { type MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import DefaultPersonItem from "$lib/sections/lists/components/DefaultPersonItem.svelte";
  import type { Snippet } from "svelte";
  import { useSearch } from "./useSearch";

  type SearchResultsGridProps = {
    title?: string;
    empty?: Snippet;
    items: Array<PersonSummary | MediaEntry>;
    // FIXME: merge trending with regular items once we figure out the rendering issue
    trendingItems?: Array<PersonSummary | MediaEntry>;
    onclick?: (item: PersonSummary | MediaEntry) => void;
  };

  const {
    title,
    items,
    trendingItems,
    empty,
    onclick,
  }: SearchResultsGridProps = $props();

  const { mode } = useSearch();

  const id = $derived($mode === "people" ? "people" : "media");
  const cardWidthVariable = $derived(
    $mode === "people" ? "--width-person-card" : "--width-portrait-card",
  );
</script>

{#snippet mediaTag(item: MediaInputDefault)}
  {#if $mode === "media"}
    <MediaIconTag mediaType={item.type} />
  {/if}

  <AirDateTag i18n={TagIntlProvider} airDate={item.airDate} />

  {#if $mode === "movie"}
    <DurationTag i18n={TagIntlProvider} runtime={item.runtime} />
  {/if}

  {#if $mode === "show" && "episode" in item}
    <EpisodeCountTag i18n={TagIntlProvider} count={item.episode.count} />
  {/if}
{/snippet}

<div class="search-results-grid">
  <GridList
    id={`search-grid-list-${id}`}
    {items}
    promotedItems={trendingItems}
    {title}
    {empty}
    --width-item={`var(--width-override-card, var(${cardWidthVariable}))`}
  >
    {#snippet item(item)}
      {#if "type" in item}
        {#snippet mediaResultTag()}
          {@render mediaTag(item)}
        {/snippet}

        <DefaultMediaItem
          type={item.type}
          media={item}
          style="cover"
          source="search"
          tag={mediaResultTag}
          {onclick}
        />
      {:else}
        <DefaultPersonItem
          person={item}
          source="search"
          variant="birthday"
          {onclick}
        />
      {/if}
    {/snippet}
  </GridList>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .search-results-grid {
    @include for-mobile {
      --column-count: 3;
      --card-aspect-ratio: calc(
        var(--height-portrait-card-cover) / var(--width-portrait-card)
      );

      --container-width: calc(
        100dvw - var(--layout-distance-side) * 2 - var(--layout-scrollbar-width)
      );
      --total-gap-width: calc(var(--gap-xxs) * (var(--column-count) - 1));
      --available-width: calc(var(--container-width) - var(--total-gap-width));

      --width-override-card: calc(var(--available-width) / var(--column-count));
      --height-override-card-cover: calc(
        var(--width-override-card) * var(--card-aspect-ratio)
      );
      --height-override-card: calc(
        var(--height-override-card-cover) + var(--height-card-footer)
      );

      :global(.trakt-list-items) {
        grid-template-columns: repeat(auto-fill, var(--width-item));
      }
    }
  }
</style>
