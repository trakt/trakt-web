<script lang="ts">
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import TrendingListItem from "./TrendingListItem.svelte";
  import { useTrendingList } from "./useTrendingList";

  type TrendingListProps = {
    title: string;
    drilldownLabel: string;
    type: MediaType;
    search?: Record<string, string>;
  };

  const { title, drilldownLabel, type, search }: TrendingListProps = $props();
  const { filterMap } = useFilter();
</script>

<DrillableMediaList
  id="trending-list-{type}"
  source={{ id: "trending", type }}
  {title}
  {drilldownLabel}
  {type}
  filter={$filterMap}
  useList={(params) =>
    useTrendingList({
      ...params,
      search,
    })}
  urlBuilder={(params) =>
    UrlBuilder.trending({
      ...params,
      search,
    })}
>
  {#snippet item(media)}
    <TrendingListItem {type} {media} />
  {/snippet}
</DrillableMediaList>
