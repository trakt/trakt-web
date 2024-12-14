<script lang="ts" generics="T extends { id: unknown }">
  import { onDestroy, type Snippet } from "svelte";

  type BatchRenderProps<T> = {
    items: T[];
    item: Snippet<[T]>;
    batchSize: number;
    delay: number;
  };

  const { items, item, batchSize, delay }: BatchRenderProps<T> = $props();

  let visibleItems = $state<T[]>([]);
  let timeoutId: number;

  function renderNextBatch() {
    const nextIndex = visibleItems.length;
    if (nextIndex >= items.length) {
      return;
    }

    const nextBatch = items.slice(nextIndex, nextIndex + batchSize);
    visibleItems = [...visibleItems, ...nextBatch];

    timeoutId = window.setTimeout(renderNextBatch, delay);
  }

  $effect.pre(() => {
    clearTimeout(timeoutId);
    visibleItems = items.slice(0, batchSize);
    timeoutId = window.setTimeout(renderNextBatch, delay);
  });

  onDestroy(() => {
    clearTimeout(timeoutId);
  });
</script>

{#each visibleItems as visibleItem (visibleItem.id)}
  {@render item(visibleItem)}
{/each}
