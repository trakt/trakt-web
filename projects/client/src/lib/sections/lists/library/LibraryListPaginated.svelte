<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import LibraryMediaItem from "./_internal/LibraryMediaItem.svelte";
  import type { Library } from "./models/Library";
  import { useLibraryList } from "./useLibraryList";

  const { library }: { library: Library } = $props();

  // FIXME: add support for library selection & sorting
</script>

<DrilledMediaList
  id="view-all-library"
  title={m.list_title_library()}
  type="media"
  useList={(params) => useLibraryList({ ...params, library })}
>
  {#snippet item(item)}
    <LibraryMediaItem {item} style="summary" />
  {/snippet}

  {#snippet empty()}
    {m.list_placeholder_personal_list_empty()}
  {/snippet}
</DrilledMediaList>
