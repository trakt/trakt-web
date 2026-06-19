<script lang="ts" generics="T extends { key: string }, M">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import type { DrilledMediaListProps } from "./MediaListProps";

  const {
    type,
    filter,
    empty: externalEmpty,
    useList,
    actions,
    cardOrientation = "portrait",
    id,
    listActions,
    ...props
  }: DrilledMediaListProps<T, M> = $props();
</script>

<PaginatedList {type} {filter} {useList}>
  {#snippet items(items, isLoading)}
    <div class="drilled-list" data-orientation={cardOrientation}>
      <GridList
        {...props}
        {id}
        {actions}
        {items}
        {listActions}
        sizing="auto"
      >
        {#snippet empty()}
          {#if !isLoading}
            {@render externalEmpty?.()}
          {/if}
        {/snippet}
      </GridList>
    </div>
  {/snippet}
</PaginatedList>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .drilled-list {
    --width-item: var(--width-summary-card);

    &[data-orientation="portrait"] {
      @include for-mouse {
        --width-item: var(--width-portrait-card);
      }
    }

    &[data-orientation="landscape"] {
      @include for-mouse {
        --width-item: var(--width-landscape-card);
      }
    }

  }
</style>
