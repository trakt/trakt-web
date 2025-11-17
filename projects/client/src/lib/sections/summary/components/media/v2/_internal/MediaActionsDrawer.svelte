<script lang="ts">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import CheckInAction from "$lib/sections/media-actions/check-in/CheckInAction.svelte";
  import SetCoverImageAction from "$lib/sections/media-actions/cover-image/SetCoverImageAction.svelte";
  import SummaryActionsDrawer from "../../../_internal/SummaryActionsDrawer.svelte";
  import SideActions from "./SideActions.svelte";

  const { media, title }: { media: MediaEntry; title: string } = $props();
</script>

<SummaryActionsDrawer {title}>
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
