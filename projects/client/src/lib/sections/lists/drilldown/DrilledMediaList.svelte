<script lang="ts" generics="T extends { id: unknown }, M">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import { DEFAULT_DRILL_SIZE } from "$lib/utils/constants";
  import type { Snippet } from "svelte";
  import { writable } from "svelte/store";
  import { mediaCardWidthResolver } from "../utils/mediaCardWidthResolver";
  import type { MediaListProps } from "./MediaListProps";
  import LoadingIndicator from "./_internal/LoadingIndicator.svelte";
  import { useLazyLoader } from "./_internal/useLazyLoader";

  type DrilledMediaListProps = MediaListProps<T, M> & {
    actions?: Snippet<[]>;
  };

  const {
    type,
    filter,
    empty: externalEmpty,
    useList,
    actions,
    ...props
  }: DrilledMediaListProps = $props();

  const currentPage = writable(1);
  const loadedPages = writable<Map<number, T[]>>(new Map());

  const { list, page, isLoading } = $derived(
    useList({
      type,
      filter,
      page: $currentPage,
      limit: DEFAULT_DRILL_SIZE,
    }),
  );

  $effect(() => {
    loadedPages.update((pages) => {
      pages.set($page.current ?? 1, $list);
      return pages;
    });
  });

  const loadMore = () => {
    const hasMorePages = ($page?.total ?? 1) > $currentPage;
    const isCurrentPageFetched =
      $loadedPages.get($page?.current ?? 1) !== undefined;

    if (isCurrentPageFetched && hasMorePages) {
      currentPage.update((page) => page + 1);
    }
  };

  const { observeDimension } = $derived(useLazyLoader({ loadMore }));
  const allItems = $derived(Array.from($loadedPages.values()).flat());
</script>

<GridList
  {...props}
  {actions}
  items={allItems}
  dimensionObserver={observeDimension}
  --width-item={mediaCardWidthResolver(type)}
>
  {#snippet empty()}
    {#if !$isLoading}
      {@render externalEmpty?.()}
    {/if}
  {/snippet}
</GridList>

{#if $isLoading}
  <LoadingIndicator />
{/if}
