<script lang="ts" generics="T extends { id: unknown }">
  import "../_internal/list.css";
  import ListHeader from "../_internal/ListHeader.svelte";
  import type { ListProps } from "../ListProps";

  type PageListProps<T> = ListProps<T>;

  const { items, title, item, actions }: PageListProps<T> = $props();
</script>

<section class="trakt-grid-list-container">
  <ListHeader {title} {actions} inset="all" />

  <div class="trakt-list-item-container trakt-list-items">
    {#each items as i (i.id)}
      {@render item(i)}
    {/each}
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

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
    grid-column-gap: var(--gap-s);
    grid-row-gap: var(--gap-l);

    @include for-mobile {
      grid-template-columns: 1fr;
    }
  }
</style>
