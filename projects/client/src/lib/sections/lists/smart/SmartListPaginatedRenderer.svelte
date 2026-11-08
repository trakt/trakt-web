<script lang="ts">
  import GlobalParameterEscaper from "$lib/features/parameters/GlobalParameterEscaper.svelte";
  import type { SmartList } from "$lib/requests/queries/users/smartListQuery";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { createSmartListItemsStore } from "./createSmartListItemsStore";
  import { toDiscoverMode } from "./toDiscoverMode";

  type PaginatedSmartListRendererProps = {
    list: SmartList;
  };

  const { list }: PaginatedSmartListRendererProps = $props();

  const type = $derived(toDiscoverMode(list.mediaType));

  const useList = createSmartListItemsStore(() => list);
</script>

<GlobalParameterEscaper enabled>
  <DrilledMediaList id={`smart-list-${list.slug}`} {type} {useList}>
    {#snippet item(media)}
      <DefaultMediaItem
        type={media.type}
        {media}
        source="smart-list"
        style="summary"
        mode={type === "media" ? "mixed" : "standalone"}
        canDeemphasize
      />
    {/snippet}
  </DrilledMediaList>
</GlobalParameterEscaper>
