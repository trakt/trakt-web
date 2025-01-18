<script lang="ts">
  import { page as pageState } from "$app/state";
  import PaginatedList from "$lib/components/lists/paginated-list/PaginatedList.svelte";
  import Paginator from "$lib/components/lists/paginated-list/Paginator.svelte";
  import { PaginatorIntlProvider } from "$lib/components/lists/paginated-list/PaginatorIntlProvider";
  import type { MediaType } from "$lib/models/MediaType";
  import { PAGE_UPPER_LIMIT } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { writable } from "svelte/store";
  import MediaItem from "../components/MediaItem.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { usePopularList } from "./usePopularList";

  type PopularListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: PopularListProps = $props();

  const current = $derived(
    parseInt(pageState.url.searchParams.get("page") ?? "1"),
  );

  const { list, page } = $derived(
    usePopularList({
      type,
      page: current,
      limit: mediaPageLimitResolver(type),
    }),
  );

  const last = writable(Infinity);

  $effect(() => {
    const total = $page.total;
    if (!total) return;
    last.set(Math.min(total, PAGE_UPPER_LIMIT));
  });
</script>

<PaginatedList
  {title}
  items={$list}
  --width-item={mediaCardWidthResolver(type)}
>
  {#snippet item(media)}
    <MediaItem {type} {media} />
  {/snippet}

  {#snippet actions()}
    <Paginator
      i18n={PaginatorIntlProvider}
      {current}
      first={1}
      last={$last}
      hrefFactory={(page) => UrlBuilder.popular({ type, page })}
    />
  {/snippet}
</PaginatedList>
