<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { FilterOverrideParams } from "$lib/requests/models/FilterParams";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import AnticipatedListItem from "./AnticipatedListItem.svelte";
  import { useAnticipatedList } from "./useAnticipatedList";

  type TrendingListProps = {
    title: string;
    drilldownLabel: string;
    type: DiscoverMode;
    search?: Record<string, string>;
    filterOverride?: FilterOverrideParams;
  };

  const {
    title,
    drilldownLabel,
    type,
    search,
    filterOverride,
  }: TrendingListProps = $props();
  const { filterMap } = useFilter();
</script>

<DrillableMediaList
  id="anticipated-list-{type}"
  source={{ id: "anticipated", type }}
  {title}
  {drilldownLabel}
  {type}
  filter={$filterMap}
  {filterOverride}
  useList={(params) =>
    useAnticipatedList({
      ...params,
      search,
    })}
  urlBuilder={(params) =>
    UrlBuilder.anticipated({
      ...params,
      search,
    })}
>
  {#snippet item(media)}
    <AnticipatedListItem
      type={media.type}
      {media}
      mode={type === "media" ? "mixed" : "standalone"}
    />
  {/snippet}
</DrillableMediaList>
