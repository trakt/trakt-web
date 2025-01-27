<script lang="ts" generics="T extends { id: unknown }">
  import { onMount, type Snippet } from "svelte";
  import { writable } from "svelte/store";
  import "../_internal/list.css";
  import ListHeader from "../_internal/ListHeader.svelte";
  import type { ListProps } from "../ListProps";

  type PageListProps<T> = ListProps<T> & {
    empty?: Snippet;
  };

  const { items, title, item, actions, empty }: PageListProps<T> = $props();

  const isMounted = writable(false);

  onMount(() => {
    isMounted.set(true);
  });
</script>

<section class="trakt-grid-list-container">
  <ListHeader {title} {actions} inset="all" />

  {#if items.length > 0}
    <div class="trakt-list-item-container trakt-list-items">
      {#each items as i (i.id)}
        {@render item(i)}
      {/each}
    </div>
  {:else if empty != null && $isMounted}
    <div class="grid-list-empty-state">
      {@render empty()}
    </div>
  {/if}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;
  @use "../_internal/gap" as *;

  .trakt-grid-list-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }

  .trakt-list-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, var(--width-item));
    /* TODO: investigate how we can better distribute empty spaces (@anodpixels) */
    justify-content: center;
    transition: gap var(--transition-increment) ease-in-out;
    grid-row-gap: var(--gap-l);
    @include adaptive-gap(grid-column-gap);

    @include for-mobile {
      grid-template-columns: 1fr;
    }
  }

  .grid-list-empty-state {
    display: flex;
    justify-content: center;

    padding: 0 var(--layout-distance-side);
  }
</style>
