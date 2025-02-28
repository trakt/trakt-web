<script lang="ts" generics="T extends { id: unknown }, M">
  import { page as pageState } from "$app/state";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import { DEFAULT_DRILL_SIZE, PAGE_UPPER_LIMIT } from "$lib/utils/constants";
  import { writable } from "svelte/store";
  import { mediaCardWidthResolver } from "../utils/mediaCardWidthResolver";
  import type { MediaListProps } from "./MediaListProps";

  type DrilledMediaListProps = MediaListProps<T, M>;

  const {
    type,
    empty: externalEmpty,
    useList,
    actions: _,
    ...props
  }: DrilledMediaListProps = $props();

  const current = $derived(
    parseInt(pageState.url.searchParams.get("page") ?? "1"),
  );

  const { list, page, isLoading } = $derived(
    useList({
      type,
      page: current,
      limit: DEFAULT_DRILL_SIZE,
    }),
  );

  const last = writable(Infinity);

  $effect(() => {
    const total = $page?.total;
    if (!total) return;
    last.set(Math.min(total, PAGE_UPPER_LIMIT));
  });
</script>

<GridList {...props} items={$list} --width-item={mediaCardWidthResolver(type)}>
  {#snippet empty()}
    {#if !$isLoading}
      {@render externalEmpty?.()}
    {/if}
  {/snippet}
</GridList>
