<script lang="ts">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import CheckInAction from "$lib/sections/media-actions/check-in/CheckInAction.svelte";
  import SetCoverImageAction from "$lib/sections/media-actions/cover-image/SetCoverImageAction.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import SummaryActionsDrawer from "../../../_internal/SummaryActionsDrawer.svelte";
  import SideActions from "./SideActions.svelte";

  const { media, title }: { media: MediaEntry; title: string } = $props();

  const { isWatched } = $derived(useIsWatched({ media, type: media.type }));
</script>

<SummaryActionsDrawer {title}>
  {#if $isWatched}
    <MarkAsWatchedAction
      style="dropdown-item"
      type={media.type}
      mode="ask"
      {title}
      {media}
    />
  {/if}

  {#if media.type === "movie"}
    <CheckInAction
      {media}
      {title}
      variant="primary"
      size="small"
      style="dropdown-item"
      type="movie"
    />
  {/if}

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
</SummaryActionsDrawer>
