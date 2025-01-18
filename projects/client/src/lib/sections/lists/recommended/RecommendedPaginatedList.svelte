<script lang="ts">
  import { page as pageState } from "$app/state";
  import PaginatedList from "$lib/components/lists/paginated-list/PaginatedList.svelte";
  import Paginator from "$lib/components/lists/paginated-list/Paginator.svelte";
  import { PaginatorIntlProvider } from "$lib/components/lists/paginated-list/PaginatorIntlProvider";
  import type { MediaType } from "$lib/models/MediaType";
  import { RECOMMENDED_UPPER_LIMIT } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import MediaItem from "../components/MediaItem.svelte";
  import { mediaCardWidthResolver } from "../utils/mediaCardWidthResolver";
  import { mediaPageLimitResolver } from "../utils/mediaPageLimitResolver";
  import { useRecommendedList } from "./useRecommendedList";

  type RecommendedListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: RecommendedListProps = $props();

  const current = $derived(
    parseInt(pageState.url.searchParams.get("page") ?? "1"),
  );

  const limit = $derived(mediaPageLimitResolver(type));

  const { list } = $derived(
    useRecommendedList({
      type,
      limit: RECOMMENDED_UPPER_LIMIT,
    }),
  );

  const first = 1;
  const last = $derived(Math.ceil(RECOMMENDED_UPPER_LIMIT / limit));

  const from = $derived((current - 1) * limit);
  const to = $derived(Math.min(current * limit, RECOMMENDED_UPPER_LIMIT));
  const visible = $derived($list.slice(from, to));
</script>

<PaginatedList
  {title}
  items={visible}
  --width-item={mediaCardWidthResolver(type)}
>
  {#snippet item(media)}
    <MediaItem {type} {media} />
  {/snippet}

  {#snippet actions()}
    <Paginator
      i18n={PaginatorIntlProvider}
      {first}
      {last}
      {current}
      hrefFactory={(page) => UrlBuilder.recommended({ type, page })}
    />
  {/snippet}
</PaginatedList>
