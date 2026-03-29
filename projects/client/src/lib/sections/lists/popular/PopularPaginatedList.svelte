<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { Snippet } from "svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import PopularListItem from "./PopularListItem.svelte";
  import { usePopularList } from "./usePopularList";

  type PopularListProps = {
    title?: string;
    type: DiscoverMode;
    actions?: Snippet;
    search?: Record<string, string>;
  };

  const { title, type, actions, search }: PopularListProps = $props();
  const { filterMap } = useFilter();
</script>

<DrilledMediaList
  id="view-all-popular-${type}"
  {title}
  {type}
  filter={$filterMap}
  useList={(params) =>
    usePopularList({
      ...params,
      search,
    })}
  {actions}
>
  {#snippet item(media)}
    <PopularListItem
      type={media.type}
      {media}
      style="summary"
      mode={type === "media" ? "mixed" : "standalone"}
    />
  {/snippet}
</DrilledMediaList>
