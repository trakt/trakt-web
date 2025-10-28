<script lang="ts" generics="T extends { id: unknown }">
  import { useScrollHistoryAction } from "$lib/components/lists/_internal/useScrollHistoryAction";
  import { onMount, type Snippet } from "svelte";
  import { writable } from "svelte/store";

  const {
    id,
    items,
    item,
    empty,
  }: { id: string; items: T[]; item: Snippet<[T]>; empty?: Snippet } = $props();

  const { scrollHistory } = useScrollHistoryAction("vertical");

  const isMounted = writable(false);

  onMount(() => {
    isMounted.set(true);
  });
</script>

{#if items.length > 0}
  <div class="vertical-list-items" use:scrollHistory={id}>
    {#each items as i (i.id)}
      {@render item(i)}
    {/each}
  </div>
{:else if empty && $isMounted}
  <div class="vertical-list-empty">
    {@render empty()}
  </div>
{/if}

<style>
  .vertical-list-empty {
    min-height: var(--ni-64);
  }

  .vertical-list-items {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: 0 var(--layout-scrollbar-width);

    overflow-y: auto;
    overscroll-behavior: contain;
  }
</style>
