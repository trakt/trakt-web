<script lang="ts">
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import HotListItem from "./HotListItem.svelte";
  import { useHotList } from "./useHotList";

  type HotListProps = {
    title: string;
    drilldownLabel: string;
    type: MediaType;
    search?: Record<string, string>;
  };

  const { title, drilldownLabel, type, search }: HotListProps = $props();
  const { filterMap } = useFilter();
</script>

<DrillableMediaList
  id="hot-list-{type}"
  {title}
  {drilldownLabel}
  {type}
  filter={$filterMap}
  useList={(params) =>
    useHotList({
      ...params,
      search,
    })}
  urlBuilder={(params) =>
    UrlBuilder.hot({
      ...params,
      search,
    })}
>
  {#snippet item(media)}
    <HotListItem {type} {media} />
  {/snippet}
</DrillableMediaList>
