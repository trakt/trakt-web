<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { FilterOverrideParams } from "$lib/requests/models/FilterParams";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import PopularListItem from "./PopularListItem.svelte";
  import { usePopularList } from "./usePopularList";

  type PopularListProps = {
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
  }: PopularListProps = $props();
  const { filterMap } = useFilter();
</script>

<DrillableMediaList
  id="popular-list-{type}"
  source={{ id: "popular", type }}
  {title}
  {drilldownLabel}
  {type}
  filter={$filterMap}
  {filterOverride}
  useList={(params) =>
    usePopularList({
      ...params,
      search,
    })}
  urlBuilder={(params) =>
    UrlBuilder.popular({
      ...params,
      search,
    })}
>
  {#snippet item(media)}
    <PopularListItem
      type={media.type}
      {media}
      mode={type === "media" ? "mixed" : "standalone"}
    />
  {/snippet}
</DrillableMediaList>
