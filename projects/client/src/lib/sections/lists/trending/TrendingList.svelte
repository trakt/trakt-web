<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import TrendingListItem from "./TrendingListItem.svelte";
  import { useTrendingList } from "./useTrendingList";

  type TrendingListProps = {
    title: string;
    drilldownLabel: string;
    type: DiscoverMode;
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
    <TrendingListItem
      type={media.type}
      {media}
      mode={type === "media" ? "mixed" : "standalone"}
    />
  {/snippet}
</DrillableMediaList>
