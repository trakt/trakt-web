<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { FilterOverrideParams } from "$lib/requests/models/FilterParams";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import type { DrillListProps } from "../drilldown/DrillListProps";
  import AnticipatedListItem from "./AnticipatedListItem.svelte";
  import { useAnticipatedList } from "./useAnticipatedList";

  type AnticipatedListProps = {
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
  }: AnticipatedListProps = $props();
  const { filterMap } = useFilter();
</script>

<DrillableMediaList
  --height-override-card="var(--height-portrait-card-sm)"
  --height-override-list="var(--height-poster-list-sm)"
  id="anticipated-list-{type}"
  source={{ id: "anticipated", type }}
  {title}
  {drilldownLabel}
  {type}
  filter={$filterMap}
  {filterOverride}
  {actions}
  useList={(params) =>
    useAnticipatedList({
      ...params,
      search,
    })}
  urlBuilder={urlBuilder ??
    ((params) =>
      UrlBuilder.anticipated({
        ...params,
        search,
      }))}
>
  {#snippet item(media)}
    <AnticipatedListItem
      type={media.type}
      {media}
      mode={type === "media" ? "mixed" : "standalone"}
    />
  {/snippet}
</DrillableMediaList>
