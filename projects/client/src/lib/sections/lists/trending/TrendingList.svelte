<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { FilterOverrideParams } from "$lib/requests/models/FilterParams";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import type { DrillListProps } from "../drilldown/DrillListProps";
  import TrendingListItem from "./TrendingListItem.svelte";
  import { useTrendingList } from "./useTrendingList";

  type TrendingListProps = {
    title: string;
    drilldownLabel: string;
    type: DiscoverMode;
    search?: Record<string, string>;
    filterOverride?: FilterOverrideParams;
    actions?: Snippet;
  } & Partial<DrillListProps<DiscoverMode>>;

  const {
    title,
    drilldownLabel,
    type,
    search,
    filterOverride,
    actions,
    urlBuilder,
  }: TrendingListProps = $props();
  const { filterMap } = useFilter();
</script>

<DrillableMediaList
  id="trending-list-{type}"
  source={{ id: "trending", type }}
  {title}
  {drilldownLabel}
  {type}
  filter={$filterMap}
  {filterOverride}
  {actions}
  useList={(params) =>
    useTrendingList({
      ...params,
      search,
    })}
  urlBuilder={urlBuilder ??
    ((params) =>
      UrlBuilder.trending({
        ...params,
        search,
      }))}
>
  {#snippet item(media)}
    <TrendingListItem
      type={media.type}
      {media}
      mode={type === "media" ? "mixed" : "standalone"}
    />
  {/snippet}
</DrillableMediaList>
