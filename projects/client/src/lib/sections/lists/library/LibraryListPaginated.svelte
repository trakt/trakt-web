<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import LibraryMediaItem from "./_internal/LibraryMediaItem.svelte";
  import { useLibraryList } from "./useLibraryList";

  const { library }: { library: string } = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id="view-all-libray"
  title={m.list_title_library()}
  type="media"
  useList={(params) => useLibraryList({ ...params, library })}
>
  {#snippet item(item)}
    <LibraryMediaItem {item} {style} />
  {/snippet}
</DrilledMediaList>
