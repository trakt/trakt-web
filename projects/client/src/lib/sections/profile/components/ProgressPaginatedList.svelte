<script lang="ts">
  import type { ProgressEntry } from "$lib/requests/models/ProgressEntry.ts";
  import type { SortBy } from "$lib/sections/lists/user/models/SortBy.ts";
  import type { SortDirection } from "$lib/sections/lists/user/models/SortDirection.ts";
  import DrilledMediaList from "$lib/sections/lists/drilldown/DrilledMediaList.svelte";
  import ProgressItem from "./_internal/progress/ProgressItem.svelte";
  import { useProgressList } from "./_internal/useProgressList.ts";

  type ProgressType = "in-progress" | "completed" | "dropped";

  const {
    type,
    sortBy,
    sortHow,
  }: {
    type: ProgressType;
    sortBy?: SortBy;
    sortHow?: SortDirection;
  } = $props();

  const displaySortBy = $derived<SortBy>(sortBy ?? "added");
  const progressGroupBy = $derived(
    displaySortBy === "title"
      ? (entry: ProgressEntry) => entry.show.title[0]?.toUpperCase() ?? "#"
      : undefined,
  );
  const showSortTag = $derived(sortBy !== "added" && displaySortBy !== "title");
</script>

<DrilledMediaList
  id="view-all-progress-{type}"
  type="show"
  groupBy={progressGroupBy}
  useList={({ limit }) => useProgressList({ type, limit, sortBy, sortHow })}
>
  {#snippet item(entry)}
    <ProgressItem
      {entry}
      style="summary"
      {type}
      sortBy={displaySortBy}
      {showSortTag}
    />
  {/snippet}
</DrilledMediaList>
