<script lang="ts">
  import DrilledMediaList from "$lib/sections/lists/drilldown/DrilledMediaList.svelte";
  import ProgressItem from "./_internal/ProgressItem.svelte";
  import { useProgressList } from "./_internal/useProgressList.ts";

  type ProgressType = "in-progress" | "completed" | "dropped";

  const { type }: { type: ProgressType } = $props();
</script>

<DrilledMediaList
  id="view-all-progress-{type}"
  type="show"
  useList={({ limit }) => useProgressList({ type, limit })}
>
  {#snippet item(entry)}
    <ProgressItem {entry} style="summary" {type} />
  {/snippet}
</DrilledMediaList>
