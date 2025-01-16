<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { page as pageState } from "$app/state";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import WatchersTag from "$lib/components/media/tags/WatchersTag.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { writable } from "svelte/store";
  import PaginatedList from "../../components/lists/paginated-list/PaginatedList.svelte";
  import MediaItem from "./components/MediaItem.svelte";
  import { useTrendingList } from "./stores/useTrendingList";
  import { mediaCardWidthResolver } from "./utils/mediaCardWidthResolver";

  type TrendingListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: TrendingListProps = $props();

  const PAGE_LIST_ITEM_COUNT = type === "movie" ? 20 : 21;

  const page = $derived(
    parseInt(pageState.url.searchParams.get("page") ?? "1"),
  );

  const { list, page: listPage } = $derived(
    useTrendingList({
      type,
      page,
      limit: PAGE_LIST_ITEM_COUNT,
    }),
  );

  const first = writable(1);
  const last = writable(Infinity);

  $effect(() => {
    const total = $listPage.total;
    if (!total) return;
    last.set(total);
  });

  const prev = $derived(Math.max(page - 1, $first));
  const next = $derived(Math.min(page + 1, $last));

  const lastPage = $derived($last === Infinity ? "∞" : $last);
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
    <div class="trakt-list-pagination">
      <ActionButton
        href={UrlBuilder.trending({
          type,
          page: prev,
        })}
        noscroll={true}
        label={m.go_to_page_number({ number: prev })}
        color="purple"
        variant="primary"
        disabled={page === $first}
      >
        <CaretLeftIcon />
      </ActionButton>
      <p>{page} / {lastPage}</p>
      <ActionButton
        href={UrlBuilder.trending({
          type,
          page: next,
        })}
        noscroll={true}
        label={m.go_to_page_number({ number: next })}
        color="purple"
        variant="primary"
        disabled={page === $last}
      >
        <CaretRightIcon />
      </ActionButton>
    </div>
  {/snippet}
</PaginatedList>

<style>
  .trakt-list-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--ni-8);
  }
</style>
