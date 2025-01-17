<script lang="ts">
  import { page as pageState } from "$app/state";
  import Paginator from "$lib/components/lists/paginated-list/Paginator.svelte";
  import { PaginatorIntlProvider } from "$lib/components/lists/paginated-list/PaginatorIntlProvider";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import WatchersTag from "$lib/components/media/tags/WatchersTag.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { writable } from "svelte/store";
  import PaginatedList from "../../components/lists/paginated-list/PaginatedList.svelte";
  import MediaItem from "./components/MediaItem.svelte";
  import { useTrendingList } from "./stores/useTrendingList";
  import { mediaCardWidthResolver } from "./utils/mediaCardWidthResolver";
  import { mediaPageLimitResolver } from "./utils/mediaPageLimitResolver";

  type TrendingListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: TrendingListProps = $props();

  const current = $derived(
    parseInt(pageState.url.searchParams.get("page") ?? "1"),
  );

  const { list, page } = $derived(
    useTrendingList({
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
    <MediaItem {type} {media}>
      {#snippet tags()}
        <WatchersTag i18n={TagIntlProvider} watchers={media.watchers} />
      {/snippet}
    </MediaItem>
  {/snippet}

  {#snippet actions()}
    <Paginator
      i18n={PaginatorIntlProvider}
      {current}
      first={1}
      last={$last}
      hrefFactory={(page) => UrlBuilder.trending({ type, page })}
    />
  {/snippet}
</PaginatedList>
