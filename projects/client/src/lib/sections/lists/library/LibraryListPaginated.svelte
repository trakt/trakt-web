<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import LibraryMediaItem from "./_internal/LibraryMediaItem.svelte";
  import { useLibraryList } from "./useLibraryList";

  const { library }: { library: string } = $props();
</script>

<DrilledMediaList
  id="view-all-libray"
  title={m.list_title_library()}
  type="media"
  useList={(params) => useLibraryList({ ...params, library })}
>
  {#snippet item(item)}
    <LibraryMediaItem {item} style="summary" />
  {/snippet}
</DrilledMediaList>
