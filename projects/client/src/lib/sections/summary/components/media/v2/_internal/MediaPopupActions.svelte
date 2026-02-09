<script lang="ts">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import ListAction from "$lib/sections/components/lists-drawer/ListAction.svelte";
  import ListsDrawer from "$lib/sections/components/lists-drawer/ListsDrawer.svelte";
  import SetCoverImageAction from "$lib/sections/media-actions/cover-image/SetCoverImageAction.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import SideActions from "./SideActions.svelte";

  const { media, title }: { media: MediaEntry; title: string } = $props();

  const { isWatched } = $derived(useIsWatched({ media, type: media.type }));
  let isListsDrawerOpen = $state(false);
</script>

{#if $isWatched}
  <MarkAsWatchedAction
    style="dropdown-item"
    type={media.type}
    mode="ask"
    {title}
    {media}
  />
{/if}

<ListAction
  style="dropdown-item"
  {media}
  {title}
  onClick={() => (isListsDrawerOpen = true)}
  variant="primary"
/>

<SideActions
  {title}
  style="dropdown-item"
  variant="primary"
  type={media.type}
/>

<SetCoverImageAction
  style="dropdown-item"
  type={media.type}
  id={media.id}
  variant="primary"
  {title}
/>

{#if isListsDrawerOpen}
  <ListsDrawer
    onClose={() => (isListsDrawerOpen = false)}
    {media}
    title={media.title}
  />
{/if}
