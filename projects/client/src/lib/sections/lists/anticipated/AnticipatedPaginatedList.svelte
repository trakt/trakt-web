<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { Snippet } from "svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import AnticipatedListItem from "./AnticipatedListItem.svelte";
  import { useAnticipatedList } from "./useAnticipatedList";

  type AnticipatedListProps = {
    title?: string;
    type: DiscoverMode;
    actions?: Snippet;
    search?: Record<string, string>;
  };

  const { title, type, actions, search }: AnticipatedListProps = $props();
  const { filterMap } = useFilter();
</script>

<DrilledMediaList
  id="view-all-anticipated-${type}"
  {title}
  {type}
  filter={$filterMap}
  useList={(params) =>
    useAnticipatedList({
      ...params,
      search,
    })}
  {actions}
>
  {#snippet item(media)}
    <AnticipatedListItem
      type={media.type}
      {media}
      style="summary"
      mode={type === "media" ? "mixed" : "standalone"}
    />
  {/snippet}
</DrilledMediaList>
