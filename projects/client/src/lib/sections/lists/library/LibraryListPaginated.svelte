<script lang="ts">
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import LibraryMediaItem from "./_internal/LibraryMediaItem.svelte";
  import type { Library } from "./models/Library";
  import { useLibraryList } from "./useLibraryList";

  type LibraryListProps = {
    library: Library;
    title?: string;
    type?: DiscoverMode;
    actions?: Snippet;
  };

  const { library, title, type, actions }: LibraryListProps = $props();

  const { mode } = useDiscover();
  // FIXME: add support for library selection & sorting
</script>

<DrilledMediaList
  id="view-all-library"
  {title}
  type={type ?? $mode}
  useList={(params) => useLibraryList({ ...params, library })}
  {actions}
>
  {#snippet item(item)}
    <LibraryMediaItem {item} style="summary" />
  {/snippet}

  {#snippet empty()}
    {m.list_placeholder_personal_list_empty()}
  {/snippet}
</DrilledMediaList>
