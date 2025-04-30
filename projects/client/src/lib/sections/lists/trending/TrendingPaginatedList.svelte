<script lang="ts">
  import { page } from "$app/state";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { decodeRecord } from "$lib/utils/url/UrlBuilder";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import TrendingListItem from "./TrendingListItem.svelte";
  import { useTrendingList } from "./useTrendingList";

  type TrendingListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: TrendingListProps = $props();
  const { filterMap } = useFilter();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id="view-all-trending-${type}"
  {title}
  {type}
  filter={$filterMap}
  useList={(params) =>
    useTrendingList({
      ...params,
      search: decodeRecord(page.url.searchParams.get("search") ?? ""),
    })}
>
  {#snippet item(media)}
    <TrendingListItem {type} {media} {style} />
  {/snippet}
</DrilledMediaList>
