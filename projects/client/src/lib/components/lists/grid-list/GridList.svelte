<script lang="ts" generics="T extends { key: string }">
  import { writable } from "$lib/utils/store/WritableSubject";
  import { onMount, type Snippet } from "svelte";
  import "../_internal/list.css";
  import ListHeader from "../_internal/ListHeader.svelte";
  import LetterGroupHeader from "../LetterGroupHeader.svelte";
  import type { ListProps } from "../ListProps";

  type PageListProps<T> = Omit<ListProps<T>, "title"> & {
    empty?: Snippet;
    title?: string;
    metaInfo?: Snippet;
    promotedItems?: T[];
    dimensionObserver?: (node: HTMLElement) => void;
    listActions?: Snippet;
    sizing?: "default" | "auto";
    groupBy?: (item: T) => string;
    groupHeader?: Snippet<[string]>;
  };

  const {
    items,
    promotedItems = [],
    title,
    item,
    actions,
    empty,
    dimensionObserver,
    metaInfo,
    listActions,
    sizing = "default",
    groupBy,
    groupHeader,
  }: PageListProps<T> = $props();

  const customAction = (node: HTMLElement) => dimensionObserver?.(node);

  const isMounted = writable(false);

  onMount(() => {
    isMounted.set(true);
  });

  const promotedKeys = $derived(new Set(promotedItems.map(({ key }) => key)));

  const uniqueItems = $derived.by(() => {
    const seenKeys = new Set<string>(promotedKeys);
    return items.filter(({ key }) => !seenKeys.has(key) && seenKeys.add(key));
  });

  const groupedItems = $derived.by(() => {
    if (!groupBy) return null;

    const groups = uniqueItems.reduce((acc, item) => {
      const key = groupBy(item);
      const group = acc.get(key) ?? [];
      group.push(item);
      acc.set(key, group);
      return acc;
    }, new Map<string, T[]>());
    return Array.from(groups, ([key, groupItems]) => ({ key, groupItems }));
  });
</script>

<section class="trakt-grid-list-container" data-sizing={sizing}>
  {#if title}
    <ListHeader {title} {metaInfo} {actions} {listActions} />
  {/if}

  {#if uniqueItems.length > 0 || promotedItems.length > 0}
    <div class="trakt-list-item-container trakt-list-items" use:customAction>
      {#each promotedItems as i (i.key)}
        {@render item(i)}
      {/each}
      {#if groupedItems}
        {#each groupedItems as group (group.key)}
          <div class="group-header">
            {#if groupHeader}
              {@render groupHeader(group.key)}
            {:else}
              <LetterGroupHeader letter={group.key} />
            {/if}
          </div>
          {#each group.groupItems as i (i.key)}
            {@render item(i)}
          {/each}
        {/each}
      {:else}
        {#each uniqueItems as i (i.key)}
          {@render item(i)}
        {/each}
      {/if}
    </div>
  {:else if empty != null && $isMounted}
    <div class="grid-list-empty-state">
      {@render empty()}
    </div>
  {/if}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-grid-list-container {
    contain: layout;

    /* Clips horizontally the same way as hidden,
    but without affecting overflow-y */
    overflow-x: clip;

    display: flex;
    flex-direction: column;

    gap: var(--list-header-gap);

    &[data-sizing="auto"] {
      .trakt-list-items {
        grid-template-columns: repeat(
          auto-fill,
          minmax(var(--width-item), 1fr)
        );

        :global(.trakt-card) {
          --width-override-card: 100%;
        }
      }
    }
  }

  .trakt-list-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, var(--width-item));

    justify-content: center;
    transition: gap var(--transition-increment) ease-in-out;
    grid-row-gap: var(--gap-l);
    grid-column-gap: var(--list-gap);

    @include for-mobile {
      grid-row-gap: var(--gap-s);
      grid-template-columns: 1fr;
    }
  }

  .group-header {
    grid-column: 1 / -1;
  }

  .grid-list-empty-state {
    display: grid;
    justify-content: center;
    gap: var(--gap-m);

    padding: 0 var(--layout-distance-side);
  }
</style>
