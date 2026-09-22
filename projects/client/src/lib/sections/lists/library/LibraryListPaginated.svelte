<script lang="ts">
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import LibraryMediaItem from "./_internal/LibraryMediaItem.svelte";
  import LibraryEmptyState from "./_internal/LibraryEmptyState.svelte";
  import type { Library } from "./models/Library";
  import { useLibraryList } from "./useLibraryList";

  const { library }: { library: Library } = $props();

  const { mode } = useDiscover();
  // FIXME: add support for library selection & sorting
</script>

<DrilledMediaList
  id="view-all-library"
  type={$mode}
  useList={(params) => useLibraryList({ ...params, library })}
>
  {#snippet item(item)}
    <LibraryMediaItem {item} style="summary" />
  {/snippet}

  {#snippet empty()}
    <LibraryEmptyState {library} />
  {/snippet}
</DrilledMediaList>
