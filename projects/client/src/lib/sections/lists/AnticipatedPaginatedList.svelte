<script lang="ts">
  import { page as pageState } from "$app/state";
  import PaginatedList from "$lib/components/lists/paginated-list/PaginatedList.svelte";
  import Paginator from "$lib/components/lists/paginated-list/Paginator.svelte";
  import { PaginatorIntlProvider } from "$lib/components/lists/paginated-list/PaginatorIntlProvider";
  import type { MediaType } from "$lib/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { writable } from "svelte/store";
  import AnticipatedMediaItem from "./components/AnticipatedMediaItem.svelte";
  import { useAnticipatedList } from "./stores/useAnticipatedList";
  import { mediaCardWidthResolver } from "./utils/mediaCardWidthResolver";
  import { mediaPageLimitResolver } from "./utils/mediaPageLimitResolver";

  type AnticipatedListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: AnticipatedListProps = $props();

  const current = $derived(
    parseInt(pageState.url.searchParams.get("page") ?? "1"),
  );

  const { list, page } = $derived(
    useAnticipatedList({
      type,
      page: current,
      limit: mediaPageLimitResolver(type),
    }),
  );

  const last = writable(Infinity);

  $effect(() => {
    const total = $page.total;
    if (!total) return;
    last.set(total);
  });
</script>

<PaginatedList
  {title}
  items={$list}
  --width-item={mediaCardWidthResolver(type)}
>
  {#snippet item(media)}
    <AnticipatedMediaItem {type} {media} />
  {/snippet}

  {#snippet actions()}
    <Paginator
      i18n={PaginatorIntlProvider}
      {current}
      first={1}
      last={$last}
      hrefFactory={(page) => UrlBuilder.anticipated({ type, page })}
    />
  {/snippet}
</PaginatedList>
