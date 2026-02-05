<script lang="ts">
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import LibraryMediaItem from "./_internal/LibraryMediaItem.svelte";
  import type { Library } from "./models/Library";
  import { useLibraryList } from "./useLibraryList";

  const { library }: { library: Library } = $props();

  const { current, set, options } = useToggler("library");

  // FIXME: add support for library selection & sorting
</script>

{#snippet metaInfo()}
  <ListMetaInfo text={$current.text()} />
{/snippet}

<DrilledMediaList
  id="view-all-library"
  title={m.list_title_library()}
  type={$current.value}
  useList={(params) => useLibraryList({ ...params, library })}
  {metaInfo}
>
  {#snippet item(item)}
    <LibraryMediaItem {item} style="summary" />
  {/snippet}

  <!-- FIXME: remove when we have the 'all' endpoint -->
  {#snippet actions()}
    <Toggler value={$current.value} onChange={set} {options} />
  {/snippet}

  {#snippet empty()}
    {m.list_placeholder_personal_list_empty()}
  {/snippet}
</DrilledMediaList>
