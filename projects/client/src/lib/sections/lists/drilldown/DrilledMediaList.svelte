<script lang="ts" generics="T extends { id: unknown }">
  import { page as pageState } from "$app/state";
  import PaginatedList from "$lib/components/lists/paginated-list/PaginatedList.svelte";
  import Paginator from "$lib/components/lists/paginated-list/Paginator.svelte";
  import { PaginatorIntlProvider } from "$lib/components/lists/paginated-list/PaginatorIntlProvider";
  import { PAGE_UPPER_LIMIT } from "$lib/utils/constants";
  import { writable } from "svelte/store";
  import { mediaCardWidthResolver } from "../utils/mediaCardWidthResolver";
  import { mediaPageLimitResolver } from "../utils/mediaPageLimitResolver";
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
      limit: mediaPageLimitResolver(type),
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
>
  {#snippet actions()}
    <Paginator
      i18n={PaginatorIntlProvider}
      {current}
      first={1}
      last={$last}
      hrefFactory={(page) => urlBuilder({ type, page })}
    />
  {/snippet}
</PaginatedList>
