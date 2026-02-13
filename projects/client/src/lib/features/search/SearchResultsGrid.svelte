<script lang="ts">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import type { Snippet } from "svelte";
  import SearchResultItem from "./_internal/SearchResultItem.svelte";
  import type { SearchItem } from "./models/SearchItem";

  type SearchResultsGridProps = {
    title?: string;
    empty?: Snippet;
    items: Array<SearchItem>;
    onclick?: (item: SearchItem) => void;
    type: "media" | "people" | "lists";
  };

  const { title, items, empty, onclick, type }: SearchResultsGridProps =
    $props();

  const cardWidthVariable = $derived.by(() => {
    switch (type) {
      case "people":
        return "--width-person-card";
      case "lists":
        return "--width-list-card";
      default:
        return "--width-portrait-card";
    }
  });
</script>

<div class="search-results-grid" data-variant={type}>
  <GridList
    id={`search-grid-list-${type}`}
    {items}
    {title}
    {empty}
    --width-item={`var(--width-override-card, var(${cardWidthVariable}))`}
  >
    {#snippet item(item)}
      <SearchResultItem {item} {onclick} />
    {/snippet}
  </GridList>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  @mixin responsive-layout($columnCount, $gap) {
    --column-count: #{$columnCount};

    --total-side-spacing: calc(
      var(--layout-distance-side) * 2 + var(--layout-scrollbar-width) +
        var(--layout-sidebar-distance)
    );
    --container-width: calc(100dvw - var(--total-side-spacing));

    --total-gap-width: calc(#{$gap} * (var(--column-count) - 1));
    --available-width: calc(var(--container-width) - var(--total-gap-width));

    --width-override-card: calc(var(--available-width) / var(--column-count));

    :global(.trakt-list-items) {
      grid-template-columns: repeat(auto-fill, var(--width-item));
    }
  }

  .search-results-grid:not([data-variant="lists"]) {
    @include for-mobile {
      @include responsive-layout(3, var(--gap-xxs));

      --card-aspect-ratio: calc(
        var(--height-portrait-card-cover) / var(--width-portrait-card)
      );
      --height-override-card-cover: calc(
        var(--width-override-card) * var(--card-aspect-ratio)
      );
      --height-override-card: calc(
        var(--height-override-card-cover) + var(--height-card-footer)
      );
    }
  }

  .search-results-grid[data-variant="lists"] {
    @include responsive-layout(3, var(--list-gap));

    @include for-tablet-lg {
      @include responsive-layout(2, var(--list-gap));
    }

    @include for-tablet-sm-and-below {
      --width-override-card: 100%;
    }
  }
</style>
