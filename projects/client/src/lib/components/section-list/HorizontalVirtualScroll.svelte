<script lang="ts" generics="T extends { id: unknown }">
  import { useVarToPixels } from "$lib/stores/css/useVarToPixels";
  import { onMount, type Snippet } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { scrollTracking } from "./scrollTracking";

  type SectionListProps<T> = {
    items: T[];
    item: Snippet<[T]>;
    scrollX?: Writable<{ left: number; right: number }>;
    scrollContainer: Writable<HTMLDivElement | null>;
  };

  const {
    items,
    item,
    scrollX = $bindable(writable({ left: 0, right: 0 })),
    scrollContainer = $bindable(writable(null)),
  }: SectionListProps<T> = $props();

  let container: HTMLDivElement;
  let sentinel = $state<HTMLDivElement | Nil>(null);

  const initialGuesstimate = 200;
  const itemWidth = writable(initialGuesstimate);
  const gapVar = "var(--ni-8)";
  const gap = useVarToPixels(gapVar);
  const fullItemWidth = $derived($itemWidth + $gap);

  let startIndex = $state(0);
  let endIndex = $state(0);
  const gutter = 2;

  $effect(() => {
    if (container == null) return;

    const scrollLeft = $scrollX.left;

    startIndex = Math.max(0, Math.floor(scrollLeft / fullItemWidth) - gutter);
    endIndex = Math.min(
      items.length,
      Math.ceil((scrollLeft + container.clientWidth) / fullItemWidth) + gutter,
    );
  });

  onMount(() => {
    scrollContainer.set(container);
  });

  $effect(() => {
    if (!sentinel) {
      return;
    }

    itemWidth.set(sentinel.getBoundingClientRect().width);
  });

  const visibleItems = $derived.by(() => {
    return items.slice(startIndex, endIndex);
  });
</script>

<div
  bind:this={container}
  use:scrollTracking={scrollX}
  class="virtual-horizontal-scroll"
  role="group"
>
  {#if items.at(0) != null}
    <div class="virtual-scroll-sentinel" bind:this={sentinel}>
      {@render item(items.at(0)!)}
    </div>
  {/if}
  <div
    class="virtual-horizontal-scroll-inner"
    style="min-width: calc({fullItemWidth}px * {items.length}); gap: {gapVar}"
  >
    <div
      class="virtual-fill"
      style="min-width: calc({fullItemWidth}px * {startIndex})"
    ></div>
    {#each visibleItems as visibleItem (visibleItem.id)}
      {@render item(visibleItem)}
    {/each}
  </div>
</div>

<style>
  .virtual-horizontal-scroll {
    padding: 0 var(--layout-distance-side);
    height: var(--height-section-list);
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scroll-behavior: smooth;

    .virtual-scroll-sentinel {
      visibility: hidden;
      position: absolute;
      top: -9999px;
      left: -9999px;
    }

    .virtual-horizontal-scroll-inner {
      display: flex;

      & > :global(:not(svelte-css-wrapper)) {
        scroll-snap-align: start;

        &:first-child,
        &:last-child {
          scroll-snap-align: end;
        }
      }

      & > :global(svelte-css-wrapper > *) {
        scroll-snap-align: start;
      }

      & > :global(svelte-css-wrapper:first-child > *),
      & > :global(svelte-css-wrapper:last-child > *) {
        scroll-snap-align: end;
      }
    }
  }
</style>
