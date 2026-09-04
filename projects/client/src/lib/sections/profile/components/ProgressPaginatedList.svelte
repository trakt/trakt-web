<script lang="ts">
  import DrilledMediaList from "$lib/sections/lists/drilldown/DrilledMediaList.svelte";
  import SortValue from "$lib/sections/lists/user/_internal/SortValue.svelte";
  import type { ListSortProps } from "$lib/sections/lists/user/models/ListSortProps.ts";
  import { useSort } from "$lib/sections/lists/user/useSort.ts";
  import ProgressItem from "./_internal/progress/ProgressItem.svelte";
  import {
    type ProgressListType,
    useProgressList,
  } from "./_internal/useProgressList.ts";

  type ProgressPaginatedListProps = {
    type: ProgressListType;
  } & ListSortProps;

  const { type, sortBy, sortHow }: ProgressPaginatedListProps = $props();

  const sort = $derived(useSort(sortBy));
</script>

<DrilledMediaList
  id="view-all-progress-{type}"
  type="show"
  groupBy={sort.groupBy}
  useList={({ limit }) => useProgressList({ type, limit, sortBy, sortHow })}
>
  {#snippet item(entry)}
    {#snippet sortTag()}
      <SortValue item={entry} {sortBy} />
    {/snippet}

    <ProgressItem
      {entry}
      style="summary"
      {type}
      sortTag={sort.toTag(sortTag)}
    />
  {/snippet}
</DrilledMediaList>
