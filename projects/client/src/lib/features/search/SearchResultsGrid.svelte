<script lang="ts">
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import InfoTag from "$lib/components/media/tags/InfoTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import { getLocale } from "$lib/features/i18n";
  import { type MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import DefaultPersonItem from "$lib/sections/lists/components/DefaultPersonItem.svelte";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";
  import type { Snippet } from "svelte";
  import { useSearch } from "./useSearch";

  type SearchResultsGridProps = {
    title?: string;
    empty?: Snippet;
    items: Array<PersonSummary | MediaEntry>;
  };

  const { title, items, empty }: SearchResultsGridProps = $props();

  const { mode } = useSearch();

  const id = $derived($mode === "people" ? "people" : "media");
  const cardWidthVariable = $derived(
    $mode === "people" ? "--width-person-card" : "--width-portrait-card",
  );
</script>

{#snippet mediaTag(item: MediaEntry)}
  <InfoTag>
    {#snippet icon()}
      {#if item.type === "movie"}
        <MovieIcon />
      {/if}

      {#if item.type === "show"}
        <ShowIcon />
      {/if}
    {/snippet}
    {toTranslatedValue("type", item.type)}
  </InfoTag>

  <AirDateTag i18n={TagIntlProvider} airDate={item.airDate} />
{/snippet}

<div class="search-results-grid">
  <GridList
    id={`search-grid-list-${id}`}
    items={items as Array<PersonSummary | MediaEntry>}
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
          tag={$mode === "media" ? mediaResultTag : undefined}
        />
      {:else}
        <DefaultPersonItem
          person={item}
          subtitle={item.birthday
            ? toHumanDay(item.birthday, getLocale(), "short")
            : undefined}
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
