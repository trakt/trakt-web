<script lang="ts" generics="T extends { id: unknown }">
  import { page as pageState } from "$app/state";
  import PaginatedList from "$lib/components/lists/paginated-list/PaginatedList.svelte";
  import { DEFAULT_PAGE_SIZE, PAGE_UPPER_LIMIT } from "$lib/utils/constants";
  import { writable } from "svelte/store";
  import { mediaCardWidthResolver } from "../utils/mediaCardWidthResolver";
  import type { DrillListProps } from "./DrillListProps";
  import type { PaginatableStore } from "./PaginatableStore";

  type DrilledPaginatedList = DrillListProps<T> & {
    useList: PaginatableStore<T>;
  };

  const { title, type, item, useList, urlBuilder }: DrilledPaginatedList =
    $props();

  const current = $derived(
    parseInt(pageState.url.searchParams.get("page") ?? "1"),
  );

  const { list, page } = $derived(
    useList({
      type,
      page: current,
      limit: DEFAULT_PAGE_SIZE,
    }),
  );

  const last = writable(Infinity);

  $effect(() => {
    const total = $page?.total;
    if (!total) return;
    last.set(Math.min(total, PAGE_UPPER_LIMIT));
  });
</script>

<PaginatedList
  {title}
  items={$list}
  {item}
  --width-item={mediaCardWidthResolver(type)}
/>
