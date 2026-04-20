<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { FilterOverrideParams } from "$lib/requests/models/FilterParams";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import type { DrillListProps } from "../drilldown/DrillListProps";
  import PopularListItem from "./PopularListItem.svelte";
  import { usePopularList } from "./usePopularList";

  type PopularListProps = {
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
  }: PopularListProps = $props();
  const { filterMap } = useFilter();
</script>

<DrillableMediaList
  --height-override-card="var(--height-portrait-card-sm)"
  --height-override-list="var(--height-poster-list-sm)"
  id="popular-list-{type}"
  source={{ id: "popular", type }}
  {title}
  {drilldownLabel}
  {type}
  filter={$filterMap}
  {filterOverride}
  {actions}
  useList={(params) =>
    usePopularList({
      ...params,
      search,
    })}
  urlBuilder={urlBuilder ??
    (() =>
      UrlBuilder.popular({
        search,
      }))}
>
  {#snippet item(media)}
    <PopularListItem
      type={media.type}
      {media}
      mode={type === "media" ? "mixed" : "standalone"}
    />
  {/snippet}
</DrillableMediaList>
