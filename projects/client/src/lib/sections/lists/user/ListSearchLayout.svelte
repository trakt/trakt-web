<script lang="ts">
  import ListSearchInput from "./ListSearchInput.svelte";
  import type { ListSearchLayoutProps } from "./models/ListSearchLayoutProps.ts";

  const { search, copy, isEmbedded, children }: ListSearchLayoutProps =
    $props();
</script>

{#if search.isOpen && !isEmbedded}
  <ListSearchInput {search} {copy} />
{/if}

<div
  class="trakt-list-search-layout"
  class:has-search-extension={search.isOpen && isEmbedded}
>
  {@render children()}
</div>

<style>
  .trakt-list-search-layout {
    display: flex;
    flex-direction: column;
    gap: var(--content-gap);

    transition: padding-top var(--transition-increment) ease-in-out;

    /* The expanded toggle overlaps the page, mirror the search page clearance. */
    &.has-search-extension {
      padding-top: calc(
        var(--segmented-select-extension-height) + var(--gap-m)
      );
    }
  }
</style>
