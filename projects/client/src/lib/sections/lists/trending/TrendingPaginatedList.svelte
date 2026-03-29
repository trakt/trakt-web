<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { Snippet } from "svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import TrendingListItem from "./TrendingListItem.svelte";
  import { useTrendingList } from "./useTrendingList";

  type TrendingListProps = {
    title?: string;
    type: DiscoverMode;
    actions?: Snippet;
    search?: Record<string, string>;
  };

  const { title, type, actions, search }: TrendingListProps = $props();
  const { filterMap } = useFilter();
</script>

<DrilledMediaList
  id="view-all-trending-${type}"
  {title}
  {type}
  filter={$filterMap}
  useList={(params) =>
    useTrendingList({
      ...params,
      search,
    })}
  {actions}
>
  {#snippet item(media)}
    <TrendingListItem
      type={media.type}
      {media}
      style="summary"
      mode={type === "media" ? "mixed" : "standalone"}
    />
  {/snippet}
</DrilledMediaList>
