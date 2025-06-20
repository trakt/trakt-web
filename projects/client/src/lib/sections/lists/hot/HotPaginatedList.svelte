<script lang="ts">
  import { page } from "$app/state";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { decodeRecord } from "$lib/utils/url/UrlBuilder";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import HotListItem from "./HotListItem.svelte";
  import { useHotList } from "./useHotList";

  type HotListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: HotListProps = $props();
  const { filterMap } = useFilter();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id="view-all-hot-${type}"
  {title}
  {type}
  filter={$filterMap}
  useList={(params) =>
    useHotList({
      ...params,
      search: decodeRecord(page.url.searchParams.get("search") ?? ""),
    })}
>
  {#snippet item(media)}
    <HotListItem {type} {media} {style} />
  {/snippet}
</DrilledMediaList>
